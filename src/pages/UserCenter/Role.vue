<template>
    <q-page padding class="q-gutter-md">
        <div class="row q-gutter-xs">
            <div class="col-inline row q-gutter-xs">
                <dm_input v-for="obj in queryInput" :key="obj" :qProps="obj" :dmType="obj.dmType" v-model="obj.value"
                    @update:model-value="getList(tbl.pagination)"></dm_input>
            </div>
            <div class="col row reverse">
                <q-btn color="primary" @click="btnClick(DMBTN.create.id)">{{ $t("create") }}</q-btn>
            </div>
        </div>
        <div class="q-gutter-xs">
            <dm_tbl :qProps="tbl" :dmBtn="dmBtn" @query="getList" @btnClick="btnClick"></dm_tbl>
        </div>

        <q-dialog v-model="actPnl.show">
            <dm_dialog :title="actPnl.title" :loading="actPnl.loading" class="dm-detail">

            </dm_dialog>
        </q-dialog>



    </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { defineComponent, ref, onMounted } from 'vue';
import { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS } from 'src/boot/dm';

import dm_tbl from 'src/components/dmTbl.vue'
import dm_input from 'src/components/dmInput.vue'
import dm_dialog from 'src/components/dmDialog.vue';

export default defineComponent({
    name: 'pRole',
    components: {
        dm_tbl,
        dm_input,
        dm_dialog,
    },

    setup() {
        const dm = new DMOBJ(useQuasar(), useRouter())
        const actPnl = ref(dm.actPnl)

        const modelRole = {
            id: { label: 'ID' },
            name: { label: '名称' },
            type: { label: '类型' },
            status: { label: '状态', options: DMOPTS.roleStatus },
            remark: { label: '备注' },
            org_id: { label: '所属组织', options: [] },
            org_name: { label: '所属组织' },
            u_dt: { label: '更新时间' },
            u_nick_name: { label: '更新人' },
        }

        const queryInput = {
            name: DMINPUT.query(modelRole.name),
            org_id: DMINPUT.query({ ...modelRole.org_id, dmType: 'select', "use-input": true }),
        }

        const tbl = ref({
            columns: [
                DMTBL.col('name', modelRole.name.label),
                DMTBL.col('org_name', modelRole.org_name.label),
                DMTBL.col('remark', modelRole.remark.label),
                {
                    ...DMTBL.col('status', modelRole.status.label, modelRole.status.options), style: row => {
                        if (row.status == 0) {
                            return 'color: #ef4864;font-weight:800'
                        } else {
                            return 'color: #25c25b;font-weight:800'
                        }
                    }
                },
                DMTBL.col('u_dt', modelRole.u_dt.label),
                DMTBL.col('u_nick_name', modelRole.u_nick_name.label),
                DMTBL.btn()
            ]
        })

        const dmBtn = [
            DMBTN.detail,
            DMBTN.edit,
            DMBTN.delete,
        ]

        const actType = {
            create: '新增角色',
            update: '修改角色',
            delete: '删除角色',
            detail: '角色详情',
        }

        function btnClick(id, props) {
            switch (id) {
                case DMBTN.create.id:
                    actPnl.value.show = true
                    actPnl.value.title = actType.create
                    actPnl.value.loading = false
                    break;
                case DMBTN.edit.id:
                    actPnl.value.show = true
                    actPnl.value.title = actType.update
                    actPnl.value.loading = false
                    break;
                case DMBTN.delete.id:
                    actPnl.value.show = true
                    actPnl.value.title = actType.delete
                    actPnl.value.loading = false
                    break;
                case DMBTN.detail.id:
                    actPnl.value.show = true
                    actPnl.value.title = actType.detail
                    actPnl.value.loading = false
                    break;
                default: break;
            }
        }

        function getList(pagination) {
            if (!tbl.value.pagination) {
                tbl.value.pagination = pagination
            }

            dm.get('/role/list', {
                page_idx: pagination.page,
                page_size: pagination.rowsPerPage,
                name: queryInput.name.value,
            }, (rsp) => {
                let val = rsp.data.records
                tbl.value.rows = rsp.data.records
                tbl.value.rows = val
                pagination.rowsNumber = rsp.data.pagination.total
            })
        }

        onMounted(() => {
            // getOrgList()
        })


        return {
            DMBTN,
            queryInput,
            tbl,
            dmBtn,
            dm,
            actPnl,

            getList,
            btnClick,
        }
    }
})
</script>

<style>
.dm-detail {
    width: 500px;
}
</style>
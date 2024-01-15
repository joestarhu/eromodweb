<template>
    <q-page padding class="q-gutter-md">
        <div class="row q-gutter-xs">
            <div class="col" v-for="obj in queryInput" :key="obj">
                <dm_input :qProps="obj" :dmType="obj.dmType" v-model="obj.value"
                    @update:model-value="getList(tbl.pagination)"></dm_input>
            </div>
            <div class="col row reverse">
                <q-btn color="primary" @click="btnClick(DMBTN.create.id)">{{ $t("create") }}</q-btn>
            </div>
        </div>
        <div class="q-gutter-xs">
            <dm_tbl :qProps="tbl" :dmBtn="dmBtn" @query="getList"></dm_tbl>
        </div>
    </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { defineComponent, ref, onMounted } from 'vue';
import { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS } from 'src/boot/dm';

import dm_tbl from 'src/components/dmTbl.vue'
import dm_input from 'src/components/dmInput.vue'

export default defineComponent({
    name: 'pRole',
    components: {
        dm_tbl,
        dm_input,
    },

    setup() {
        const dm = new DMOBJ(useQuasar(), useRouter())

        const modelRole = {
            id: { label: 'ID' },
            name: { label: '名称' },
            type: { label: '类型' },
            status: { label: '状态' },
            remark: { label: '备注' },
            org_id: { label: '所属组织', options: [] },
            org_name: { label: '所属组织' },
            u_dt: { label: '更新时间' },
            u_nick_name: { label: '更新人' },
        }

        const queryInput = ref({
            name: DMINPUT.query(modelRole.name),
            org_id: DMINPUT.query({ ...modelRole.org_id, dmType: 'select' }),
        })

        const tbl = ref({
            columns: [
                DMTBL.col('name', modelRole.name.label),
                DMTBL.col('type', modelRole.type.label),
                DMTBL.col('org_name', modelRole.org_name.label),
                DMTBL.col('status', modelRole.status.label),
                DMTBL.col('remark', modelRole.remark.label),
                DMTBL.col('u_dt', modelRole.u_dt.label),
                DMTBL.col('u_nick_name', modelRole.u_nick_name.label),
                DMTBL.btn()
            ]
        })

        const dmBtn = [
            DMBTN.edit,
            DMBTN.delete,
        ]

        async function getOrgList() {
            let rsp = await dm.get('/org/all')
            let opts = []
            if (rsp && rsp.data.code == 0) {
                for (let val of rsp.data.data) {
                    opts.push({ label: val['name'], value: val['id'] })
                }
            }
            queryInput.value.org_id.options = opts
            return opts
        }



        async function getList(pagination) {
            if (!tbl.value.pagination) {
                tbl.value.pagination = pagination
            }

            let rsp = await dm.get('/role/list', {
                page_idx: pagination.page,
                page_size: pagination.rowsPerPage,
                name: queryInput.value.name.value,
                org_id: queryInput.value.org_id.value,

            })

            if (rsp && rsp.data.code == 0) {
                tbl.value.rows = rsp.data.data.records
                pagination.rowsNumber = rsp.data.data.pagination.total
            }
        }




        onMounted(() => {
            getOrgList()
        })


        return {
            DMBTN,
            queryInput,
            tbl,
            dmBtn,

            getList,
        }
    }
})
</script>
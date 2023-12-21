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
import { defineComponent, ref } from 'vue';
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
            remark: { label: '备注' },
            org_id: { label: '所属组织' },
            org_name: { label: '所属组织' },
            u_dt: { label: '更新时间' },
            u_nick_name: { label: '更新人' },
        }

        const queryInput = {
            name: DMINPUT.query(modelRole.name),
        }


        const tbl = ref({
            columns: [
                DMTBL.col('name', modelRole.name.label),
                DMTBL.col('org_name', modelRole.org_name.label),
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


        async function getList(pagination) {
            if (!tbl.value.pagination) {
                tbl.value.pagination = pagination
            }

            let rsp = await dm.get('/role/list', {
                page_idx: pagination.page,
                page_size: pagination.rowsPerPage,
                name: queryInput.name.value,
            })

            if (rsp && rsp.data.code == 0) {
                tbl.value.rows = rsp.data.data.records
                pagination.rowsNumber = rsp.data.data.pagination.total
            }
        }



        return {
            queryInput,
            tbl,
            dmBtn,

            getList,
        }
    }
})
</script>
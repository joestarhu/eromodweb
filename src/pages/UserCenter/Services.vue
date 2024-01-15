<template>
    <q-page padding class="q-gutter-md">
        <div class="row q-gutter-xs">
            <div class="col" v-for="obj in queryInput" :key="obj">
                <dm_input :qProps="obj" :dmType="obj.dmType" v-model="obj.value"
                    @update:model-value="getList(tbl.pagination)"></dm_input>
            </div>
            <div class="col">

            </div>
        </div>
        <div class="q-gutter-xs">
            <dm_tbl :qProps="tbl" :dmBtn="dmBtn"></dm_tbl>
        </div>

    </q-page>
</template>


<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS } from 'src/boot/dm';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_input from 'src/components/dmInput.vue';

export default defineComponent({
    name: 'pService',
    components: {
        dm_tbl,
        dm_input,
    },


    setup() {
        const dm = new DMOBJ(useQuasar(), useRouter())
        const modelService = {
            id: { label: 'ID' },
            name: { label: '名称' },
            u_dt: { label: '更新时间' },
            u_nick_name: { label: '更新人' },
        }
        const queryInput = {
            name: DMINPUT.query(modelService.name),
        }


        const tbl = ref({
            columns: [
                DMTBL.col('id', modelService.id.label),
                DMTBL.col('name', modelService.name.label),
                DMTBL.col('u_dt', modelService.u_dt.label),
                DMTBL.col('u_nick_name', modelService.u_nick_name.label,),
                DMTBL.btn()
            ],
            rows: [
                { id: 1, name: '统一用户中心', u_dt: '2024-01-01', u_nick_name: 'admin' },
            ],
        })

        const dmBtn = [
            DMBTN.edit,
            DMBTN.delete,
        ]


        function getList() {

        }


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
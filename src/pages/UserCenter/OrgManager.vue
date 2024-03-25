<template>
    <q-page padding>
        <div>
            <dm_tbl :qProps="tbl" :dmQueryInput='dmQueryInput' :dmHeaderBtn='dmHeaderBtn' :dmRowBtn="dmRowBtn"
                @query="getList" @btnClick="btnClick"></dm_tbl>
        </div>
    </q-page>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { modelBase, modelOrg } from 'src/boot/model';
import { DMOBJ, DMTBL, DMBTN, DMINPUT } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_dialog from 'src/components/dmDialog.vue';
import dm_form from 'src/components/dmForm.vue';

const { t } = useI18n();
const dm = new DMOBJ(useQuasar(), useRouter());

const actRes = {
    create: { title: '新增组织', url: '/org/create', },
    update: { title: '修改组织', url: '/org/update', },
    delete: { title: '删除组织', url: '/org/delete', },
}

const dmQueryInput = {
    name: DMINPUT.query(modelOrg.name),
    status: DMINPUT.query({ ...modelOrg.status, dmType: 'select' }),
}

const dmHeaderBtn = [DMBTN.create]
const dmRowBtn = [DMBTN.update, DMBTN.delete]

const tbl = ref({
    columns: [
        DMTBL.col('name', modelOrg.name.label),
        DMTBL.col('remark', modelOrg.remark.label),
        DMTBL.col('owner_name', modelOrg.owner_name.label),
        { ...DMTBL.col('upd_dt', modelBase.upd_dt.label), format: val => `${val.split("T").join(" ")}` },
        DMTBL.col('upd_nick_name', modelBase.upd_name.label),
        {
            ...DMTBL.col('status', modelOrg.status.label, modelOrg.status.options), style: row => {
                let sts = modelOrg.status
                for (let t in sts.options) {
                    if (sts.options[t].value == row.status) {
                        return sts.options[t].style
                    }
                }
                return ''
            },
        },
        DMTBL.btn(),
    ],
    pagination: null,
})

function getList(pagination) {
    let data = {
        page_idx: pagination.page,
        page_size: pagination.rowsPerPage,
        name: dmQueryInput.name.value,
        status: dmQueryInput.status.value,
    }

    if (!tbl.value.pagination) {
        tbl.value.pagination = pagination
    }

    dm.get('/org/list', data, tbl.value, (rsp) => {
        tbl.value.rows = rsp.data.records
        pagination.rowsNumber = rsp.data.pagination.total
    })
}

function btnClick(btnID, props = null) {

}


</script>
<template>
    <q-page padding>
        <div>
            <dm_tbl :qProps="tbl" :dmQueryInput='dmQueryInput' :dmHeaderBtn='dmHeaderBtn' :dmRowBtn="dmRowBtn"
                @query="getList" @btnClick="btnClick"></dm_tbl>
        </div>


        <q-dialog persistent v-model="actPnl.show">
            <dm_dialog class="dm-detail" :title="actPnl.res.title" :showAct="false">
                <dm_form @submit="btnClick(DMBTN.confrim.id)" :btnLoading="actPnl.res.loading">
                    <div v-if="actPnl.loading">
                        <q-skeleton v-for=" obj of viewDetail" :key="obj" class="q-mb-md" type="QInput"></q-skeleton>
                    </div>
                    <div v-else>
                        <div v-if="actPnl.res.title === actRes.delete.title">
                            <span>请确认是否删除
                                <span class="text-negative">角色:{{ actPnl.data.name }}</span>
                                的数据
                            </span>
                        </div>
                        <div v-if="actPnl.res.title === actRes.create.title">
                            <dm_input v-for=" obj of viewDetail" :key="obj" :qProps="obj" :dmType="obj.dmType"
                                v-model="obj.value" />
                        </div>
                        <div v-if="actPnl.res.title === actRes.update.title">
                            <dm_input v-for=" obj of viewDetail" :key="obj" :qProps="obj" :dmType="obj.dmType"
                                v-model="obj.value" />
                        </div>
                    </div>
                    <template #right_btn v-if="actPnl.loading">
                        <q-skeleton type="QBtn"></q-skeleton>
                    </template>
                </dm_form>
            </dm_dialog>
        </q-dialog>
    </q-page>




</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { modelBase, modelRole } from 'src/boot/model';
import { DMOBJ, DMTBL, DMBTN, DMINPUT } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_dialog from 'src/components/dmDialog.vue';
import dm_form from 'src/components/dmForm.vue';

const { t } = useI18n();
const dm = new DMOBJ(useQuasar(), useRouter());

const actRes = {
    create: { title: '新增角色', url: '/role/create', },
    update: { title: '修改角色', url: '/role/update', },
    delete: { title: '删除角色', url: '/role/delete', },
}

const actPnl = ref({
    show: false,
    loading: false,
    res: actRes.create,
    data: null,
})


const viewDetail = {
    name: DMINPUT.required({ ...modelRole.name, rules: [val => val && val.length > 0 || t('msgRequired')] }),
    status: DMINPUT.input({ ...modelRole.status, dmType: 'select', value: 1 }),
    remark: DMINPUT.input({ ...modelRole.remark, type: "textarea" }),
}


const dmQueryInput = {
    name: DMINPUT.query(modelRole.name),
    status: DMINPUT.query({ ...modelRole.status, dmType: 'select' }),
}

const dmHeaderBtn = [DMBTN.create]
const dmRowBtn = [DMBTN.update, DMBTN.delete]

const tbl = ref({
    columns: [
        DMTBL.col('name', modelRole.name.label),
        DMTBL.col('remark', modelRole.remark.label),
        { ...DMTBL.col('upd_dt', modelBase.upd_dt.label), format: val => `${val.split("T").join(" ")}` },
        DMTBL.col('upd_nick_name', modelBase.upd_name.label),
        {
            ...DMTBL.col('status', modelRole.status.label, modelRole.status.options), style: row => {
                let sts = modelRole.status
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

    dm.get('/role/list', data, tbl.value, (rsp) => {
        tbl.value.rows = rsp.data.records
        pagination.rowsNumber = rsp.data.pagination.total
    })
}

function getDetail(id) {
    dm.get('/role/detail', { id: id }, actPnl.value, (rsp) => {
        for (let kw in viewDetail) {
            viewDetail[kw].value = rsp.data[kw]
        }
    })

}



function btnClick(btnID, props = null) {
    let pnl = actPnl.value
    switch (btnID) {
        case DMBTN.create.id:
            pnl.show = true
            pnl.res = actRes.create
            for (let kw in viewDetail) {
                viewDetail[kw].value = (kw != 'status' ? '' : 1);
            }
            break;
        case DMBTN.update.id:
            pnl.show = true
            pnl.res = actRes.update
            pnl.data = props.row
            getDetail(pnl.data.id)
            break;
        case DMBTN.delete.id:
            pnl.show = true
            pnl.res = actRes.delete
            pnl.data = props.row
            break;
        case DMBTN.confrim.id:
            let data = null
            switch (pnl.res.title) {
                case actRes.create.title:
                    data = {
                        name: viewDetail.name.value,
                        owner_id: viewDetail.owner_id.value,
                        status: viewDetail.status.value,
                        remark: viewDetail.remark.value,
                    };
                    break;
                case actRes.update.title:
                    data = {
                        id: pnl.data.id,
                        phone: viewDetail.phone.value,
                        acct: viewDetail.acct.value,
                        nick_name: viewDetail.nick_name.value,
                        real_name: viewDetail.real_name.value,
                        status: viewDetail.status.value,
                    }
                    break;
                case actRes.delete.title:
                    data = {
                        id: pnl.data.id,
                    }
                    break;
                default:
                    // should not be here...
                    break;
            }
            dm.post(pnl.res.url, data, pnl.res, (rsp) => {
                dm.msgOK({ message: '操作成功' })
                getList(tbl.value.pagination)
                pnl.show = false
            })

            break;
        default:
            break;

    }

}


</script>

<style>
.dm-detail {
    width: 500px;
    /* min-height: 40vh; */
    max-height: 80vh;
}
</style>
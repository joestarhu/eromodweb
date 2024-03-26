<template>
    <q-page padding>
        <div class="row-inline">
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
                                <span class="text-negative">账号:{{ actPnl.data.acct }}</span>,
                                <span class="text-negative">昵称:{{ actPnl.data.nick_name }}</span>
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
import { dmOPTS, modelBase, modelUser } from 'src/boot/model';
import { DMOBJ, DMTBL, DMBTN, DMINPUT } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_dialog from 'src/components/dmDialog.vue';
import dm_form from 'src/components/dmForm.vue';

const { t } = useI18n();
const dm = new DMOBJ(useQuasar(), useRouter());

const viewDetail = {
    phone: DMINPUT.required({ ...modelUser.phone, rules: [val => val && val.length > 0 || t('msgRequired')], mask: '###-####-####', 'unmasked-value': true }),
    acct: DMINPUT.required({ ...modelUser.acct, rules: [val => val && val.length > 0 || t('msgRequired')], }),
    nick_name: DMINPUT.required({ ...modelUser.nick_name, rules: [val => val && val.length > 0 || t('msgRequired')] }),
    real_name: DMINPUT.input(modelUser.real_name),
    status: DMINPUT.select({ ...modelUser.status, value: modelUser.status.options[0] }),
}


const actRes = {
    create: { title: '新增账户', url: '/account/create', },
    update: { title: '修改账户', url: '/account/update', },
    delete: { title: '删除账户', url: '/account/delete', },
}

const actPnl = ref({
    show: false,
    loading: false,
    res: actRes.create,
    data: null,
})

const tbl = ref({
    columns: [
        DMTBL.col('phone', modelUser.phone.label),
        DMTBL.col('acct', modelUser.acct.label),
        DMTBL.col('nick_name', modelUser.nick_name.label),
        { ...DMTBL.col('upd_dt', modelBase.upd_dt.label), format: val => `${val.split("T").join(" ")}` },
        DMTBL.col('upd_nick_name', modelBase.upd_name.label),
        {
            ...DMTBL.col('status', modelUser.status.label, modelUser.status.options), style: row => {
                let sts = modelUser.status
                for (let t in sts.options) {
                    if (sts.options[t].value == row.status) {
                        return sts.options[t].style
                    }
                }
                return ''
            }
        },
        DMTBL.btn(),
    ],
    pagination: null,
})

const dmQueryInput = {
    phone: DMINPUT.query(modelUser.phone),
    nick_name: DMINPUT.query(modelUser.nick_name),
    status: DMINPUT.query({ ...modelUser.status, dmType: 'select' }),
}
const dmHeaderBtn = [DMBTN.create]
const dmRowBtn = [DMBTN.update, DMBTN.delete]


function btnClick(btnID, props = null) {
    let pnl = actPnl.value
    switch (btnID) {
        case DMBTN.create.id:
            pnl.show = true;
            pnl.res = actRes.create
            viewDetail.phone.readonly = false
            viewDetail.acct.readonly = false
            for (let kw in viewDetail) {
                viewDetail[kw].value = kw != 'status' ? '' : 1;
            }
            break;
        case DMBTN.update.id:
            pnl.show = true
            pnl.res = actRes.update
            pnl.data = props.row
            viewDetail.phone.readonly = true
            viewDetail.acct.readonly = true
            getDetail(pnl.data.id)
            break;
        case DMBTN.delete.id:
            pnl.show = true;
            pnl.res = actRes.delete
            pnl.data = props.row;
            break;
        case DMBTN.confrim.id:
            let data = null
            switch (pnl.res.title) {
                case actRes.create.title:
                    data = {
                        phone: viewDetail.phone.value,
                        acct: viewDetail.acct.value,
                        nick_name: viewDetail.nick_name.value,
                        real_name: viewDetail.real_name.value,
                        status: viewDetail.status.value,
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
            // should not be here...
            break;
    }
}




function getList(pagination) {
    let data = {
        page_idx: pagination.page,
        page_size: pagination.rowsPerPage,
        nick_name: dmQueryInput.nick_name.value,
        phone: dmQueryInput.phone.value,
        status: dmQueryInput.status.value,
    }

    if (!tbl.value.pagination) {
        tbl.value.pagination = pagination
    }

    dm.get('/account/list', data, tbl.value,
        (rsp) => {
            let val = rsp.data.records
            val = val.map(item => ({
                // ...item, u_name: item['u_nick_name'] + '(' + item['u_real_name'] + ')'
                ...item, u_name: item['upd_nick_name']
            }))
            tbl.value.rows = val
            pagination.rowsNumber = rsp.data.pagination.total
        })
}

function getDetail(id) {
    dm.get('/account/detail', { id: id }, actPnl.value, (rsp) => {
        for (let kw in viewDetail) {
            viewDetail[kw].value = rsp.data[kw]
        }
    })

}
</script>


<style>
.dm-detail {
    width: 500px;
    /* min-height: 40vh; */
    max-height: 80vh;
}
</style>
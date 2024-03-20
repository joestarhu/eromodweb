<template>
    <q-page padding class="q-gutter-md">
        <div class="row-inline">
            <dm_tbl :qProps="tbl" :dmQueryInput='dmQueryInput' :dmHeaderBtn='dmHeaderBtn' :dmBtn="dmBtn" @query="getList" @btnClick="btnClick"></dm_tbl>
        </div>

        <q-dialog persistent v-model="actPnl.show">
            <dm_dialog class="dm-detail" :title="actPnl.type" :showAct="false">
                <dm_form @submit="btnClick(DMBTN.confrim.id)" :btnLoading="actPnl.btnLoading" v-if="actPnl.type==actType.delete">
                    <dm_input></dm_input>
                </dm_form>
                <dm_form @submit="btnClick(DMBTN.confrim.id)" :btnLoading="actPnl.btnLoading" v-else>
                    <dm_input v-for=" obj of viewDetail" :key="obj" :qProps="obj" :dmType="obj.dmType" v-model="obj.value" />
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
import { modelBase,modelUser } from 'src/boot/model';
import { DMOBJ, DMTBL, DMBTN, DMINPUT } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_dialog from 'src/components/dmDialog.vue';
import dm_form from 'src/components/dmForm.vue';

const {t} = useI18n();
const dm = new DMOBJ(useQuasar(), useRouter());

const actType = {
    create:'新增账户',
    update:'修改账户',
    delete:'删除账户',
}

const actPnl = ref({
    show:false,
    loading:false,
    btnLoading:false,
    type:actType.create,
    data:null,
})


const viewDetail = {
    phone:DMINPUT.required({...modelUser.phone, rules: [val => val && val.length > 0 || t('msgRequired')],mask: '###-####-####', 'unmasked-value': true ,}),
    acct:DMINPUT.required({...modelUser.acct,rules: [val => val && val.length > 0 || t('msgRequired')],}),
    nick_name:DMINPUT.required({...modelUser.nick_name,rules: [val => val && val.length > 0 || t('msgRequired')]}),
    real_name:DMINPUT.input(modelUser.real_name),
    status:DMINPUT.select({...modelUser.status,value:modelUser.status.options[0]}),
}

const tbl = ref({
    columns:[
        DMTBL.col('phone', modelUser.phone.label),
        DMTBL.col('acct', modelUser.acct.label),
        DMTBL.col('nick_name', modelUser.nick_name.label),
        { ...DMTBL.col('upd_dt', modelBase.upd_dt.label), format: val => `${val.split("T").join(" ")}` },
        DMTBL.col('upd_nick_name', modelBase.upd_name.label),
        {
            ...DMTBL.col('status', modelUser.status.label, modelUser.status.options), style: row => {
                if (row.status == 0) {
                    return 'color: #ef4864;font-weight:800'
                } else {
                    return 'color: #25c25b;font-weight:800'
                }
            }
        },
        DMTBL.btn(),
    ],
    pagination:null,
})

const dmQueryInput = {
    phone:DMINPUT.query(modelUser.phone),
    nick_name:DMINPUT.query(modelUser.nick_name),
    status:DMINPUT.query({...modelUser.status, dmType: 'select'}),
}
const dmHeaderBtn = [DMBTN.create]
const dmBtn = [DMBTN.update,DMBTN.delete]


function btnClick(btnID,props=null){
    let pnl = actPnl.value
    switch(btnID){
        case DMBTN.create.id:
            pnl.show = true;
            pnl.type = actType.create;
            pnl.data = props

            viewDetail.phone.readonly=false
            viewDetail.acct.readonly=false
            for(let kw in viewDetail ){
                viewDetail[kw].value = kw!='status' ? '':1;
            }
            break;
        case DMBTN.update.id:
            pnl.show = true
            pnl.type = actType.update
            pnl.data = props
            viewDetail.phone.readonly=true
            viewDetail.acct.readonly=true
            break;
        case DMBTN.delete.id:
            pnl.show = true;
            pnl.type = actType.delete;
            pnl.data = props;
            break;
        case DMBTN.confrim.id:
            pnl.btnLoading = true;
            break;
        default:break;
    }
}

function getList(pagination){
    if (!tbl.value.pagination) {
        tbl.value.pagination = pagination
    }

    dm.get('/user/list', {
        page_idx: pagination.page,
        page_size: pagination.rowsPerPage,
        nick_name: dmQueryInput.nick_name.value,
        phone: dmQueryInput.phone.value,
        status: dmQueryInput.status.value,
    }, 
    tbl.value,
    (rsp) => {
        let val = rsp.data.records
        tbl.value.rows = rsp.data.records
        val = val.map(item => ({
            // ...item, u_name: item['u_nick_name'] + '(' + item['u_real_name'] + ')'
            ...item, u_name: item['upd_nick_name']
        }))
        tbl.value.rows = val
        pagination.rowsNumber = rsp.data.pagination.total
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
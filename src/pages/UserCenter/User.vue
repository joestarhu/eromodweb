<template>
    <q-page>
        <q-card flat>
            <q-card-section class="row q-gutter-xs">
                <div class="col q-gutter-xs" v-for="obj in queryInput" :key="obj">
                    <dm_input :qProps="obj" :dmType="obj.dmType" v-model="obj.value"
                        @update:model-value="getList(tbl.pagination)"></dm_input>
                </div>
                <div class="col row reverse">
                    <q-btn color="primary" @click="btnClick(DMBTN.create.id)">{{ $t("create") }}</q-btn>
                </div>
            </q-card-section>

            <q-card-section class="column q-gutter-xs">
                <dm_tbl :qProps="tbl" :dmBtn="dmBtn" @query="getList" @btnClick="btnClick"></dm_tbl>
            </q-card-section>
        </q-card>


        <q-dialog presistent v-model="actPnl.show">
            <dm_dialog class="dm-detail" :title="actPnl.type" @submit="btnClick(DMBTN.confrim.id)">
                <div v-if="actPnl.type == actType.create || actPnl.type == actType.update">
                    <dm_input v-for=" obj of actInput" :key="obj" :qProps="obj" :dmType="obj.dmType" v-model="obj.value" />
                </div>
                <div v-if="actPnl.type == actType.delete">
                    <span class="text-negative text-h6">{{ actPnl.data.nick_name }}</span>即将被删除,删除后数据可能无法恢复
                </div>
            </dm_dialog>
        </q-dialog>

    </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_dialog from 'src/components/dmDialog.vue';

export default defineComponent({
    name: 'pUser',
    components: {
        dm_tbl,
        dm_input,
        dm_dialog,
    },

    setup() {
        const dm = new DMOBJ(useQuasar())
        const modelUser = {
            id: { label: 'ID' },
            acct: { label: '账号', maxlength: 32 },
            nick_name: { label: '用户昵称', maxlength: 32 },
            real_name: { label: '用户实名', maxlength: 32 },
            phone: { label: '手机号', },
            status: { label: '状态', options: DMOPTS.userStatus },
            u_dt: { label: '更新时间' },
            u_nick_name: { label: '更新人' },
        }

        const queryInput = {
            nick_name: DMINPUT.query(modelUser.nick_name),
            phone: DMINPUT.query(modelUser.phone),
            status: DMINPUT.query({ ...modelUser.status, dmType: 'select' }),
        }

        const tbl = ref({
            columns: [
                DMTBL.col('acct', modelUser.acct.label),
                DMTBL.col('nick_name', modelUser.nick_name.label),
                DMTBL.col('phone', modelUser.phone.label),
                {
                    ...DMTBL.col('status', modelUser.status.label, modelUser.status.options), style: row => {
                        if (row.status == 0) {
                            return 'color: #ef4864;font-weight:800'
                        } else {
                            return 'color: #25c25b;font-weight:800'
                        }
                    }
                },
                DMTBL.col('u_dt', modelUser.u_dt.label),
                // { ...DMTBL.col('u_dt', modelUser.u_dt.label), format: val => `${val.split("T").join(" ")}` },
                DMTBL.col('u_nick_name', modelUser.u_nick_name.label,),
                DMTBL.btn()
            ],
        })

        const dmBtn = [
            DMBTN.edit,
            DMBTN.delete,
        ]

        const actType = {
            create: '新增用户',
            update: '修改用户',
            delete: '删除用户',
        }
        const actPnl = ref({
            show: false,
            type: actType.create,
            data: null,
        })
        const actInput = {
            id: DMINPUT.input({ ...modelUser.id, value: '', readonly: true, placeholder: '系统自动生成', 'stack-label': true }),
            acct: DMINPUT.input({ ...modelUser.acct, value: '', rules: [val => val && val.length > 0 || '请输入'] }),
            nick_name: DMINPUT.input({ ...modelUser.nick_name, value: '', rules: [val => val && val.length > 0 || '请输入'] }),
            real_name: DMINPUT.input({ ...modelUser.real_name, }),
            phone: DMINPUT.input({ ...modelUser.phone, value: '', mask: '###-####-####', 'unmasked-value': true }),
            status: DMINPUT.input({ ...modelUser.status, dmType: 'select', value: 1 })
        }


        function showActPnl(type, data) {
            let obj = actPnl.value
            obj.type = type
            obj.data = data

            switch (type) {
                case actType.create:
                    obj.show = true
                    actInput.id.value = ''
                    actInput.acct.value = ''
                    actInput.nick_name.value = ''
                    actInput.real_name.value = ''
                    actInput.phone.value = ''
                    actInput.status.value = 1
                    break;
                case actType.update:
                    getDetail()
                    break;
                case actType.delete:
                    obj.show = true
                    break;
                default: break;
            }
        }

        function btnClick(id, prop) {
            switch (id) {
                case DMBTN.create.id:
                    showActPnl(actType.create)
                    break;
                case DMBTN.edit.id:
                    showActPnl(actType.update, prop.row)
                    break;
                case DMBTN.delete.id:
                    showActPnl(actType.delete, prop.row)
                    break;
                case DMBTN.confrim.id:
                    let url = ''
                    let data = ''
                    let message = ''
                    switch (actPnl.value.type) {
                        case actType.create:
                            url = '/user/create'
                            data = {
                                acct: actInput.acct.value,
                                nick_name: actInput.nick_name.value,
                                real_name: actInput.real_name.value,
                                phone: actInput.phone.value,
                                status: actInput.status.value,
                            }
                            message = '新增用户成功'
                            break;
                        case actType.update:
                            url = '/user/update'
                            data = {
                                id: actInput.id.value,
                                acct: actInput.acct.value,
                                nick_name: actInput.nick_name.value,
                                real_name: actInput.real_name.value,
                                phone: actInput.phone.value,
                                status: actInput.status.value,
                            }
                            message = '修改用户成功'
                            break;
                        case actType.delete:
                            url = '/user/delete'
                            data = { id: actPnl.value.data.id }
                            message = '删除用户成功'
                            break;
                        default: break;
                    }

                    postData(url, data, message)
                    break;
                default:
                    break;
            }
        }



        async function postData(url, data, message) {
            let rsp = await dm.post(url, data)

            if (rsp.data.code == 0) {
                dm.msgOK({ message: message })
                actPnl.value.show = false
                getList(tbl.value.pagination)
            }
        }


        // 获取列表数据
        async function getList(pagination) {
            if (!tbl.value.pagination) {
                tbl.value.pagination = pagination
            }

            let rsp = await dm.get('/user/list', {
                page_idx: pagination.page,
                page_size: pagination.rowsPerPage,
                nick_name: queryInput.nick_name.value,
                phone: queryInput.phone.value,
                status: queryInput.status.value,
            })

            tbl.value.rows = rsp.data.data.records
            pagination.rowsNumber = rsp.data.data.pagination.total
        }

        // 获取详情数据
        async function getDetail() {
            let rsp = await dm.get('/user/detail', { id: actPnl.value.data.id })
            if (rsp.data.code == 0) {
                actPnl.value.show = true
                let rspData = rsp.data.data
                for (let obj in actInput) {
                    actInput[obj].value = rspData[obj]
                }
            }
        }


        return {
            DMBTN,
            queryInput,
            tbl,
            dmBtn,
            actType,
            actPnl,
            actInput,

            btnClick,
            getList,

        }
    }
})
</script>

<style>
.dm-detail {
    width: 500px;
}
</style>
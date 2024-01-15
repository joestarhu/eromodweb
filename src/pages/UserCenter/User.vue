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
            <dm_tbl :qProps="tbl" :dmBtn="dmBtn" @query="getList" @btnClick="btnClick"></dm_tbl>
        </div>

        <q-dialog persistent v-model="actPnl.show">
            <dm_dialog class="dm-detail" :title="actPnl.type" :showAct="false" :loading="actPnl.loading">
                <dm_form @submit="btnClick(DMBTN.confrim.id)" v-if="actPnl.type == actType.create">
                    <dm_input v-for=" obj of actInput" :key="obj" :qProps="obj" :dmType="obj.dmType" v-model="obj.value" />
                </dm_form>

                <q-splitter v-model="splitter" v-else-if="actPnl.type == actType.update">
                    <template #before>
                        <q-tabs v-model="tab" vertical active-color="primary">
                            <q-tab v-bind="tabType.basic"></q-tab>
                            <!-- <q-tab v-bind="tabType.org"></q-tab> -->
                            <q-tab v-bind="tabType.security"></q-tab>
                        </q-tabs>
                    </template>
                    <template #after>
                        <q-tab-panels v-model="tab" vertical>
                            <q-tab-panel v-bind="tabType.basic" class="dm-tab-pnl">
                                <dm_form @submit="btnClick(DMBTN.confrim.id)" :title="tabType.basic.label">
                                    <dm_input v-for=" obj of actInput" :key="obj" :qProps="obj" :dmType="obj.dmType"
                                        v-model="obj.value" />
                                </dm_form>
                            </q-tab-panel>
                            <q-tab-panel v-bind="tabType.security" class="dm-tab-pnl">
                                密码修改和三方账户
                            </q-tab-panel>
                        </q-tab-panels>
                    </template>
                </q-splitter>

                <dm_form @submit="btnClick(DMBTN.confrim.id)" v-else>
                    <span class="text-negative text-h6">{{ actPnl.data.nick_name }}</span>即将被删除,删除后数据可能无法恢复
                </dm_form>
            </dm_dialog>
        </q-dialog>
    </q-page>
</template>

<script>
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { defineComponent, ref } from 'vue';
import { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_dialog from 'src/components/dmDialog.vue';
import dm_form from 'src/components/dmForm.vue';

export default defineComponent({
    name: 'pUser',
    components: {
        dm_tbl,
        dm_input,
        dm_dialog,
        dm_form,
    },

    setup() {
        const splitter = ref(20)
        const tab = ref('basic')
        const tabType = {
            basic: { label: '基础信息', name: 'basic' },
            // org: { label: '组织角色', name: 'org' },
            security: { label: '账号安全', name: 'security' },
        }


        const dm = new DMOBJ(useQuasar(), useRouter())
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
            loading: true,
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

        async function btnClick(id, prop) {
            let obj = actPnl.value
            obj.show = true
            obj.loading = true
            switch (id) {
                case DMBTN.create.id:
                    obj.type = actType.create
                    for (let key in actInput) {
                        actInput[key].value = key != 'status' ? '' : 1;
                    }
                    obj.loading = false
                    break;
                case DMBTN.edit.id:
                    obj.type = actType.update
                    await getDetail(prop.row.id)
                    break;
                case DMBTN.delete.id:
                    obj.type = actType.delete
                    obj.data = prop.row
                    obj.loading = false
                    break;
                case DMBTN.confrim.id:
                    let url = ''
                    let data = ''
                    let message = ''
                    obj.loading = false
                    switch (obj.type) {
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
                            data = { id: obj.data.id }
                            message = '删除用户成功'
                            break;
                        default: break;
                    }
                    postData(url, data, message)
                    break;
                default: break;  // should not be here...
            }
        }

        function postData(url, data, message) {
            dm.post(url, data, (rsp) => {
                dm.msgOK({ message: message })
                getList(tbl.value.pagination)
                actPnl.value.show = false
            })
        }


        // 获取列表数据
        function getList(pagination) {
            if (!tbl.value.pagination) {
                tbl.value.pagination = pagination
            }

            dm.get('/user/list', {
                page_idx: pagination.page,
                page_size: pagination.rowsPerPage,
                nick_name: queryInput.nick_name.value,
                phone: queryInput.phone.value,
                status: queryInput.status.value,
            }, (rsp) => {
                tbl.value.rows = rsp.data.records
                pagination.rowsNumber = rsp.data.pagination.total
            })
        }

        // 获取详情数据
        async function getDetail(id) {
            await dm.get('/user/detail', { id: id }, (rsp) => {
                for (let obj in actInput) {
                    actInput[obj].value = rsp.data[obj]
                }
            })
            actPnl.value.loading = false
        }


        return {
            DMBTN,
            queryInput,
            tbl,
            dmBtn,
            actType,
            actPnl,
            actInput,
            splitter,
            tab,
            tabType,

            btnClick,
            getList,

        }
    }
})
</script>

<style>
.dm-detail {
    width: 500px;
    /* min-height: 40vh; */
    max-height: 80vh;
}

.dm-tab-pnl {
    min-height: 500px;
    max-height: 80vh;
}
</style>
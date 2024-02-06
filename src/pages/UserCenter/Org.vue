<template>
    <q-page padding class="q-gutter-md">
        <div class="row q-gutter-xs">
            <div class="col-inline row q-gutter-xs">
                <dm_input v-for="obj in queryInput" :key="obj" :qProps="obj" :dmType="obj.dmType" v-model="obj.value"
                    @update:model-value="getList(tbl.pagination)"></dm_input>
            </div>
            <div class="col row reverse">
                <q-btn color="primary" @click="btnClick(DMBTN.create.id, null)">{{ $t("create")
                }}</q-btn>
            </div>
        </div>
        <div class="q-gutter-xs">
            <dm_tbl :qProps="tbl" :dmBtn="dmBtn" @query="getList" @btnClick="btnClick"></dm_tbl>
        </div>

        <q-dialog v-model="actPnl.show" persistent>
            <dm_dialog class='dm-detail' :title="actPnl.type" :showAct="false" v-if="actPnl.type != actType.dept"
                :loading="actPnl.loading">
                <dm_form @submit="btnClick(DMBTN.confrim.id)" v-if="actPnl.type == actType.delete">
                    <span class="text-negative text-h6">{{ actPnl.data.name }}</span>即将被删除,删除后数据可能无法恢复
                </dm_form>
                <dm_form @submit="btnClick(DMBTN.confrim.id)" v-else>
                    <dm_input v-for=" obj of actInput" :key="obj" :qProps="obj" :dmType="obj.dmType" v-model="obj.value" />
                </dm_form>
            </dm_dialog>
            <dm_dialog class='dm-dept' :title="actPnl.type" :showAct="false" :loading="actPnl.loading" v-else>
                <q-splitter v-model="splitter">
                    <template #before>
                        <q-card flat>
                            <q-card-section>
                                <span>查询条件</span>
                            </q-card-section>
                            <q-card-section>
                                <q-tree :nodes="dept" v-model:selected='selected_dept' node-key="id" label-key='name'
                                    selected-color="primary" no-selection-unset @lazy-load="lazyLoad">
                                    <template #default-header="prop">
                                        <div class="col text-bold ellipsis">
                                            {{ prop.node.name }}
                                        </div>
                                        <div class="col row reverse q-gutter-xs">
                                            <q-btn rounded flat dense icon="delete"></q-btn>
                                            <q-btn rounded flat dense icon="edit"></q-btn>
                                            <q-btn rounded flat dense icon="add"></q-btn>
                                        </div>
                                    </template>
                                </q-tree>
                            </q-card-section>
                        </q-card>
                    </template>
                    <template #after>
                        <q-card flat>
                            <q-card-section>
                                query
                            </q-card-section>
                            <q-card-section>
                                tbl
                            </q-card-section>
                        </q-card>
                    </template>
                </q-splitter>
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
import dm_dialog from 'src/components/dmDialog.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_form from 'src/components/dmForm.vue';

export default defineComponent({
    name: 'pOrg',
    components: {
        dm_form,
        dm_input,
        dm_dialog,
        dm_tbl,
    },
    setup() {
        const dm = new DMOBJ(useQuasar(), useRouter())
        const splitter = 40

        const modelOrg = {
            id: { label: 'ID' },
            name: { label: '组织名称', maxlength: 32 },
            owner_id: { label: '组织所有者ID', },
            status: { label: '组织状态', options: DMOPTS.orgStatus },
            remark: { label: '备注' },
            u_dt: { label: '更新时间' },
            u_nick_name: { label: '更新人' },
            owner_name: { label: '组织所有者' },
        }

        const queryInput = {
            name: DMINPUT.query(modelOrg.name),
            status: DMINPUT.query({ ...modelOrg.status, dmType: 'select' }),
        }

        const actType = {
            create: '新增组织',
            update: '修改组织',
            dept: '部门信息',
            delete: '删除组织',
        }

        const actPnl = ref({
            show: false,
            type: actType.create,
            data: null,
            loading: true,
        })

        const dept = ref([
            { id: 1, name: 'EromodeXYZ', lazy: true, },
        ])

        const selected_dept = ref(1)

        const actInput = {
            id: DMINPUT.input({ ...modelOrg.id, value: '', readonly: true, placeholder: '系统自动生成', 'stack-label': true }),
            name: DMINPUT.input({ ...modelOrg.name, value: '', rules: [val => val && val.length > 0 || '请输入'] }),
            owner_id: DMINPUT.input({ ...modelOrg.owner_id, value: '', rules: [val => val && val.length > 0 || '请输入'] }),
            status: DMINPUT.input({ ...modelOrg.status, dmType: 'select', value: 1 }),
            remark: DMINPUT.input({ ...modelOrg.remark, type: "textarea" }),
        }

        const tbl = ref({
            columns: [
                DMTBL.col('id', modelOrg.id.label),
                DMTBL.col('name', modelOrg.name.label),
                DMTBL.col('owner_name', modelOrg.owner_name.label),
                DMTBL.col('remark', modelOrg.remark.label),
                {
                    ...DMTBL.col('status', modelOrg.status.label, modelOrg.status.options), style: row => {
                        if (row.status == 0) {
                            return 'color: #ef4864;font-weight:800'
                        } else {
                            return 'color: #25c25b;font-weight:800'
                        }
                    }
                },
                DMTBL.col('u_dt', modelOrg.u_dt.label),
                DMTBL.col('u_nick_name', modelOrg.u_nick_name.label),
                DMTBL.btn()
            ],
        })

        const dmBtn = [
            DMBTN.dept,
            DMBTN.edit,
            DMBTN.delete,
        ]

        function btnClick(id, props) {
            let obj = actPnl.value
            obj.show = true
            obj.loading = true

            switch (id) {
                case DMBTN.create.id:
                    obj.type = actType.create
                    obj.loading = false
                    for (let key in actInput) {
                        if (key == 'status') {
                            continue;
                        }
                        actInput[key].value = ''
                    }
                    break;
                case DMBTN.edit.id:
                    obj.type = actType.update
                    getDetail(props.row.id)
                    break;
                case DMBTN.dept.id:
                    obj.type = actType.dept
                    obj.loading = false
                    break;
                case DMBTN.delete.id:
                    obj.type = actType.delete
                    obj.loading = false
                    obj.data = props.row
                    break;
                case DMBTN.confrim.id:
                    obj.loading = false
                    let url = ''
                    let message = ''
                    let data = ''
                    switch (actPnl.value.type) {
                        case actType.create:
                            url = '/org/create'
                            message = '新增组织成功'
                            data = {
                                name: actInput.name.value,
                                owner_id: actInput.owner_id.value,
                                status: actInput.status.value,
                                remark: actInput.remark.value,
                            }
                            break;
                        case actType.update:
                            url = '/org/update'
                            message = '修改组织成功'
                            data = {
                                id: actInput.id.value,
                                name: actInput.name.value,
                                owner_id: actInput.owner_id.value,
                                status: actInput.status.value,
                                remark: actInput.remark.value,
                            }
                            break;
                        case actType.delete:
                            url = '/org/delete'
                            message = '删除组织成功'
                            data = {
                                id: obj.data.id
                            }
                            break;
                        default: break;
                    }
                    postData(url, data, message)
                    break;
                default: break
            }
        }


        async function postData(url, data, message) {
            dm.post(url, data, (rsp) => {
                dm.msgOK({ message: message })
                actPnl.value.show = false
                getList(tbl.value.pagination)
            })
        }

        // 获取列表数据
        async function getList(pagination) {
            if (!tbl.value.pagination) {
                tbl.value.pagination = pagination
            }

            dm.get('/org/list', {
                page_idx: pagination.page,
                page_size: pagination.rowsPerPage,
                name: queryInput.name.value,
                status: queryInput.status.value,
            }, (rsp) => {
                tbl.value.rows = rsp.data.records
                pagination.rowsNumber = rsp.data.pagination.total
            })
        }

        async function getDetail(org_id) {
            await dm.get('/org/detail', { id: org_id }, (rsp) => {
                actInput.id.value = rsp.data.id
                actInput.name.value = rsp.data.name
                actInput.owner_id.value = rsp.data.owner_id
                actInput.status.value = rsp.data.status
                actInput.remark.value = rsp.data.remark
            })
            actPnl.value.loading = false
        }


        async function lazyLoad({ node, key, done, fail }) {
            let val = []
            await dm.get('/org/children', { id: key }, (rsp) => {
                val = rsp.data
                val = val.map(item => ({
                    ...item, lazy: true
                }))
            })
            done(val)
        }



        return {
            DMBTN,
            queryInput,
            actType,
            actPnl,
            actInput,
            tbl,
            dmBtn,
            splitter,
            dept,
            selected_dept,
            btnClick,
            getList,
            lazyLoad,

        }
    }
})
</script>

<style scoped>
.dm-detail {
    width: 500px;
}

.dm-dept {
    width: 88vw;
    height: 88vh;
}
</style>
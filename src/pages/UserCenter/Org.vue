<template>
    <q-page>
        <q-splitter v-model="splittter">
            <template #before>
                <div class="q-pa-md">
                    <div class="row">
                        <div class="col">
                            <q-input placeholder="输入组织名进行搜索" dense filled>
                                <template #prepend>
                                    <q-icon name="search"></q-icon>
                                </template>
                            </q-input>
                        </div>
                        <div class="row col reverse">
                            <q-btn color="primary" @click="btnClick(DMBTN.create.id, null)">{{ $t("create") }}</q-btn>
                        </div>
                    </div>
                    <div class="columns">
                        <q-tree :nodes="dataOrg" node-key="id" label-key="label" v-model:selected="selected"
                            selected-color="primary" no-selection-unset>
                            <template #default-header="prop">
                                <div class="row items-center" style="width:100%">
                                    <span> {{ prop.node.label }}</span>
                                    <q-btn dense flat icon="edit"></q-btn>
                                    <q-btn dense flat icon="delete"></q-btn>
                                </div>
                            </template>
                        </q-tree>
                    </div>
                </div>
            </template>
            <template #after>
                <div class="q-pa-md">
                    <div>
                        {{ selected }}
                        <!-- 展示所属组织下的用户信息 -->
                    </div>
                </div>
            </template>
        </q-splitter>


        <q-dialog v-model="actPnl.show">
            <dm_dialog class='dm-detail' :title="actPnl.type">
                <div class="q-gutter-sm">
                    <q-input label="名称" dense filled></q-input>
                    <q-select label="父节点" dense filled clearable></q-select>
                    <q-input label="备注" type="textarea" dense filled></q-input>
                </div>

            </dm_dialog>
        </q-dialog>

    </q-page>
</template>


<script>
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { DMOBJ, DMBTN } from 'src/boot/dm';

// import dm_input from 'src/components/dmInput.vue';
import dm_dialog from 'src/components/dmDialog.vue'

export default defineComponent({
    name: 'pOrg',
    components: {
        // dm_input,
        dm_dialog,
    },
    setup() {
        const dm = new DMOBJ(useQuasar())
        const selected = ref('')

        const modelOrg = {
            id: { label: 'ID' },
            name: { label: '名称', maxlength: 32 },
            remark: { label: '备注' },
            u_dt: { label: '更新时间' },
            u_nick_name: { label: '更新人' },
        }



        const actType = {
            create: '新增组织部门',
            update: '修改组织部门',
            delete: '删除组织部门',
        }
        const actPnl = ref({
            show: false,
            type: actType.create,
            data: null,
        })



        const dataOrg = [
            {
                id: 1,
                label: 'EROMOD',
                children: [
                    { id: 2, label: '综合部' },
                    { id: 3, label: '技术部' },
                ]
            },
            {
                id: 4,
                label: 'EROMOD123',
                children: [
                    { id: 5, label: '综合部' },
                    { id: 6, label: '技术部' },
                ]
            },

        ]

        const splittter = ref(35)

        function btnClick(id, data) {
            switch (id) {
                case DMBTN.create.id:
                    actPnl.value.show = true
                    actPnl.value.type = actType.create
                    break;
                default: break
            }

        }



        return {
            DMBTN,

            actType,
            actPnl,


            splittter,
            selected,
            dataOrg,

            btnClick,

        }
    }
})
</script>

<style scoped>
.dm-detail {
    width: 500px;
}
</style>
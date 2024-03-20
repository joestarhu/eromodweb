<template>
    <q-table v-bind="qProps" :rows-per-page-options="rows_per_page_options" :pagination="pagination"
        v-model:pagination="pagination" @request="onRequest" class="q-pa-md" bordered flat>
        <template v-slot:top>
            <div class="col row q-col-gutter-xs">
                <dm_input v-for="obj in dmQueryInput" :key="obj" :qProps="obj" :dmType="obj.dmType" v-model="obj.value"
                  @update:model-value="onRequest(null)"/>
            </div>
            <div class="col-inline reverse q-gutter-xs">
                <q-btn v-for="obj in dmHeaderBtn" :key="obj.id" :label="obj.label" :color="obj.color" @click="btnClick(obj.id,props)"/>
            </div>
        </template>

        <template v-slot:loading>
            <q-inner-loading showing  color="primary">
            </q-inner-loading>
          </template>

        <!-- 行操作栏 -->
        <template #body-cell-btns="props">
            <q-td :props="props">
                <q-btn v-for="obj in dmBtn" :key="obj.id" :label="obj.label" :color="obj.color"
                    @click="btnClick(obj.id, props)" dense flat />
            </q-td>
        </template>
    </q-table>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import dm_input from 'src/components/dmInput.vue';

export default defineComponent({
    name: 'dm_tbl',
    emits: ['btnClick', 'query'],
    components:{dm_input},

    props: {
        qProps: {
            type: Object,
        },
        // 每行的操作按钮
        dmBtn: {
            default: [],
        },
        // 查询组件
        dmQueryInput:{
            default:{},
        },
        //头部操作按钮 
        dmHeaderBtn:{
            default:[],
        },
    },
    setup(props, ctx) {
        const rows_per_page_options = [10, 20, 30, 100]
        const pageSize = localStorage.getItem('pageSize')
        const pagination = ref({
            page: 1,
            rowsNumber: 0,
            rowsPerPage: 10,
        })

        function onRequest(data) {
            if(data != null){
                pagination.value.page = data.pagination.page
                if (pagination.value.rowsPerPage != data.pagination.rowsPerPage) {
                    localStorage.setItem('pageSize', data.pagination.rowsPerPage)
                    pagination.value.rowsPerPage = data.pagination.rowsPerPage
                }
            }

            ctx.emit('query', pagination.value)
        }

        function btnClick(id, data) {
            ctx.emit('btnClick', id, data)
        }

        onMounted(() => {
            // 读取通用的
            if (pageSize) {
                pagination.value.rowsPerPage = pageSize
            }
            ctx.emit('query', pagination.value)
        })

        return {
            pagination,
            rows_per_page_options,
            btnClick,
            onRequest,
        }
    }
})
</script>
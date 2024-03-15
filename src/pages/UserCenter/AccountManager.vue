<template>
    <q-page padding class='q-gutter-md'>
        <div class="row q-gutter-xs">
            <div class="col-inline">
                <dm_input v-model="model.phone.value" :qProps="resourceQuery.account"></dm_input>
            </div>
        </div>
        <div class="row-inline q-gutter-xs">
            <dm_tbl :qProps="tblProps"></dm_tbl>
        </div>
    </q-page>
</template>



<script setup>
import { ref } from 'vue';
// import { useQuasar } from 'quasar';
import { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';

// 定义数据模型
const model = {
    account:{label:'账号'},
    phone:{label:'手机号'},
    status:{label:'状态'},
}

const resourceQuery = {
    account:DMINPUT.query(model.account),
    phone:DMINPUT.query(model.phone),
}

let loading = true;
const tblProps = {
    loading:true,
}


</script>

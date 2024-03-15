<template>
    <q-page padding class='q-gutter-md'>
        <div class="row q-gutter-xs">
            <div class="col">
                <dm_input v-model="phone" :qProps="query_input"></dm_input>
            </div>
        </div>
        <div class="row-inline q-gutter-xs">
            <q-table flat bordered ></q-table>
        </div>
    </q-page>
</template>



<script setup>
import { ref } from 'vue';
// import { useQuasar } from 'quasar';
import { DMOBJ, DMTBL, DMBTN, DMINPUT, DMOPTS } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';



let phone = ref('');
let query_input = DMINPUT.query({"label":"账号"});

</script>

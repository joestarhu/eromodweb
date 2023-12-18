<template>
    <q-input v-if="dmType == 'text'" v-bind="qProps" v-model.trim="innerValue"></q-input>
    <q-select v-if="dmType == 'select'" v-bind="qProps" v-model.trim="innerValue" emit-value map-options></q-select>
    <!-- <span v-if="dmType == 'radio'" class="text">{{ qProps.label }}</span>
    <q-radio v-if="dmType == 'radio'" v-bind="qProps" v-model="innerValue"></q-radio> -->
    <!-- <q-toggle v-if="dmType == 'toggle'" v-bind="qProps" v-model="innerValue" left-label></q-toggle> -->
</template>
<script>
import { defineComponent, watch, ref } from 'vue';
export default defineComponent({
    name: 'dm_input',
    emits: ['update:modelValue'],
    props: {
        qProps: {
            type: Object,
        },
        dmType: {
            type: String,
            required: true,
            default: 'text',
        },
        modelValue: {
            required: true,
        },
    },
    setup(props, ctx) {
        const innerValue = ref(props.modelValue);
        // 监听内部值的改变，更新父组件的值
        watch(innerValue, newValue => {
            ctx.emit('update:modelValue', newValue);
        });
        return {
            innerValue,
        }
    },
})
</script>
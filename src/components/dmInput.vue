<template>
    <q-input v-if="dmType == 'text'" v-model.trim="innerValue" v-bind="qProps" />

    <q-input v-if="dmType == 'query'" v-model.trim="innerValue" :clearable="true" v-bind="qProps">
        <template v-slot:append>
            <q-icon size="0.5em" name="search" />
        </template>
    </q-input>

    <q-input v-if="dmType == 'required'" v-model.trim="innerValue" v-bind="qProps">
        <template v-slot:append>
            <q-icon size="0.5em" name="tag" />
            <span style="font-size: 0.5em">必填</span>
        </template>
    </q-input>

    <q-select v-if="dmType == 'select'" v-model.trim="innerValue" v-bind="qProps" emit-value map-options>
        <template #no-option>
            <q-item>
                <q-item-section class="text-grey">
                    {{ $t('msgNoData') }}
                </q-item-section>
            </q-item>
        </template>
        <template #option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.caption }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>

    <q-select v-if="dmType == 'selectFilter'" emit-value map-options use-input v-bind="qProps" v-model.trim="innerValue"
        @filter="filterFn">
        <template #no-option>
            <q-item>
                <q-item-section class="text-grey">
                    {{ $t('msgNoData') }}
                </q-item-section>
            </q-item>
        </template>
        <template #option="scope">
            <q-item v-bind="scope.itemProps">
                <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                    <q-item-label caption>{{ scope.opt.caption }}</q-item-label>
                </q-item-section>
            </q-item>
        </template>
    </q-select>
</template>
<script>
import { defineComponent, watch, watchEffect, ref } from 'vue';
export default defineComponent({
    name: 'dm_input',
    emits: ['update:modelValue', 'filter'],
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
        watch(
            innerValue,
            newValue => {
                ctx.emit('update:modelValue', newValue);
            },
        );

        // 父组件的值改变,子组件也变动
        watchEffect(() => {
            innerValue.value = props.modelValue;
        });

        return {
            innerValue,
            filterFn(val, update, abort) {
                ctx.emit('filter', val, update, abort)
            }
        }
    },
})
</script>
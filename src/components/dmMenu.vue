<template>
    <!-- <q-item-label header class="text-weight-bold text-uppercase" :caption="caption" v-show="title">
        {{ title }}
    </q-item-label> -->
    <q-expansion-item v-for='info in children' :icon="info.icon ? info.icon : 'widgets'" :key="info.to"
        :label="info.title" :to="info.to" :href="info.link" hide-expand-icon>
    </q-expansion-item>
    <q-separator class="q-ma-sm" />
</template>


<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'dm_menu',
    props: {
        // 标题
        title: { type: String, required: true },
        // 副标题
        caption: { type: String, default: '' },
        // 图标
        icon: { type: String, default: '' },
        // 跳转路由链接
        to: { type: String, default: '#' },
        // 子菜单
        children: { type: Object, default: null },
    },
})
</script>

<template>
    <q-card class="card-pnl">
        <q-card-section class="row items-center ">
            <div class="col ellipsis">
                <span class="text-h6">
                    {{ title }}
                </span>
            </div>
            <div class="col row reverse">
                <q-btn icon="close" round flat dense v-close-popup />
            </div>
        </q-card-section>

        <q-form @submit="submit">
            <q-card-section>
                <slot></slot>
            </q-card-section>

            <q-card-section class="row">
                <div class="col">
                </div>
                <div class="col row reverse q-gutter-sm">
                    <q-btn color="primary" type="submit">确定</q-btn>
                    <q-btn v-close-popup>取消</q-btn>
                </div>

            </q-card-section>
        </q-form>
    </q-card>
</template>


<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'dm-dialog',
    emits: ['submit'],
    props: {
        title: {
            type: String,
            default: '标题',
        },
    },
    setup(props, ctx) {
        function submit() {
            ctx.emit('submit')
        }
        return {
            submit,
        }
    }
})
</script>


<style scoped>
.card-pnl {
    max-width: 88vw;
    max-height: 88vh;
}
</style>
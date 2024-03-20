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

        <q-form @submit="submit" v-if="loading == false">
            <q-card-section>
                <slot></slot>
            </q-card-section>

            <q-card-section class="row" v-if="showAct == true">
                <div class="col">
                </div>
                <div class="col row reverse q-gutter-sm">
                    <q-btn color="primary" type="submit">{{ $t('save') }}</q-btn>
                    <q-btn v-close-popup>{{ $t('cancel') }}</q-btn>
                </div>
            </q-card-section>
        </q-form>
        <q-inner-loading :showing="loading" label="Please wait..." label-class="text-teal" label-style="font-size: 1.1em" />
    </q-card>
</template>


<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'dm_dialog',
    emits: ['submit'],
    props: {
        title: {
            type: String,
            default: '标题',
        },
        showAct: {
            type: Boolean,
            default: true,
        },
        loading: {
            type: Boolean,
            default: false,
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
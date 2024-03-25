<template>
    <q-card class="card-pnl" flat>
        <q-card-section class="row q-pt-none q-pb-none" v-if="title != ''">
            <div class="col ellipsis">
                <span class="text-bold">
                    {{ title }}
                </span>
            </div>
        </q-card-section>

        <q-form @submit="submit">
            <q-card-section>
                <slot></slot>
            </q-card-section>

            <q-card-section class="row q-pt-none">
                <div class="col">
                    <slot name="left_btn"></slot>
                </div>
                <div class="col row reverse q-gutter-sm">
                    <slot name="right_btn">
                        <q-btn color="primary" type="submit" :loading="btnLoading">{{ btnMsg }}</q-btn>
                        <q-btn v-close-popup>{{ $t('cancel') }}</q-btn>
                    </slot>
                </div>
            </q-card-section>
        </q-form>
    </q-card>
</template>

<script>
import { defineComponent } from 'vue';
export default defineComponent({
    name: 'dm_form',
    emits: ['submit'],
    props: {
        title: {
            type: String,
            default: '',
        },
        btnMsg: {
            type: String,
            default: '确认',
        },
        btnLoading: {
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

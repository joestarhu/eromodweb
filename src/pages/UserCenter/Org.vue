<template>
    <q-page padding>
        <q-card flat bordered>
            <q-card-section>
                <q-splitter v-model="splittter">
                    <template #before>
                        <div class="q-pa-xs">
                            <!-- <q-tree></q-tree> -->
                        </div>
                    </template>
                    <template #after>
                        <div class="q-pa-xs">
                            right
                        </div>
                    </template>
                </q-splitter>
            </q-card-section>
        </q-card>
    </q-page>
</template>


<script>
import { useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import { DMOBJ } from 'src/boot/dm';

export default defineComponent({
    name: 'pOrg',
    setup() {
        const dm = new DMOBJ(useQuasar())

        const splittter = ref(35)
        return {
            splittter

        }
    }
})
</script>

<style scoped></style>
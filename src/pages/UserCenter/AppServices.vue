<template>
    <q-page padding>
        <q-dialog persistent v-model="show">
            <dm_dialog class="dm-detail" :showAct="false">
                <dm_form>
                    <div class="q-gutter-md" v-if="title == 0">
                        <!-- <q-select v-bind="tp.qProps" v-model.trim="tp.value" emit-value map-options use-input
                            @filter="get_user_info">
                            <template #option="scope">
                                <q-item v-bind="scope.itemProps">
                                    <q-item-section>
                                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                                        <q-item-label caption>手机号:{{ scope.opt.caption }}</q-item-label>
                                    </q-item-section>
                                </q-item>
                            </template>
<template #no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        {{ $t('msgNoData') }}
                                    </q-item-section>
                                </q-item>
                            </template>
</q-select> -->


                        <dm_input v-for="obj of viewDetail" :key="obj" :qProps="obj.qProps" :dmType="obj.dmType"
                            v-model="obj.value" @filter="get_user_info" />

                        <dm_input :dmType="viewDetail.owner_id.dmType" :qProps="viewDetail.owner_id.qProps"
                            v-model="viewDetail.owner_id.value" @filter="get_user_info" />

                        <dm_input dmType="selectFilter" :qProps="tp.qProps" v-model="tp.value"
                            @filter="get_user_info" />
                    </div>
                    <div class="q-gutter-md" v-else>
                    </div>
                </dm_form>
            </dm_dialog>
        </q-dialog>

        <q-btn @click="btnClick(0)">0:{{ selectValue }}</q-btn>
        <q-btn @click="btnClick(0)">1:{{ selectValue }}</q-btn>

    </q-page>

</template>



<script setup>
import { useI18n } from "vue-i18n"
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'
import { ref, watch } from 'vue';
import { modelBase, modelOrg } from 'src/boot/model';
import { DMOBJ, DMTBL, DMBTN, DMINPUT } from 'src/boot/dm';
import dm_input from 'src/components/dmInput.vue';
import dm_tbl from 'src/components/dmTbl.vue';
import dm_dialog from 'src/components/dmDialog.vue';
import dm_form from 'src/components/dmForm.vue';

const qProps = ref({
    outlined: true,
    label: '管理人',
    loading: false,
    style: "width: 250px",
})
const selectValue = ref(null)
const dm = new DMOBJ(useQuasar(), useRouter());
const show = ref(false)
const title = ref(0)

const tp = ref({
    qProps: qProps
})

const viewDetail = {
    owner_id: DMINPUT.selectFilter(modelOrg.owner_name).value,
    // owner_id: tp,
    // owner_id: ref({ dmType: 'selectFilter', qProps: qProps, }),
}


function btnClick(val) {
    show.value = true;
    title.value = val

    for (let obj in viewDetail) {
        console.log(viewDetail[obj])
    }
}



function get_user_info(val, update, abort) {
    update(
        () => {
            let data = {
                phone: val,
                page_idx: 1,
                page_size: 5,
                status: 1,
            }

            let control = viewDetail.owner_id.qProps
            // let control = qProps.value

            dm.get('/account/list', data, control, (rsp) => {
                control.options = []
                for (let x of rsp.data.records) {
                    control.options.push({ label: x.nick_name, value: x.id, caption: x.phone })
                }
            })
        },
        // ref => {
        //     if (val !== '' && ref.options.length > 0) {
        //         ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
        //         ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
        //     }
        // }
    )
}

// function get_user_info(val, update, abort) {
//     console.log(val)
//     update(
//         () => {
//             let data = {
//                 page_idx: 1,
//                 page_size: 10,
//                 phone: val,
//                 status: 1,
//             }

//             console.log(val)
//             dm.get('/account/list', data, qProps, (rsp) => {
//                 qProps.value.options = []
//                 for (let x of rsp.data.records) {
//                     // console.log(x.id,x.nickname)
//                     qProps.value.options.push({ label: x.nick_name, value: x.id, caption: x.phone })
//                 }

//             })
//         }
//     )
// }


const stringOptions = [
    'Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'
].reduce((acc, opt) => {
    for (let i = 1; i <= 3; i++) {
        acc.push(opt + ' ' + i)
    }
    return acc
}, [])

const options = ref(stringOptions)
const model = ref(null)




function filterFn(val, update, abort) {
    setTimeout(() => {
        update(
            () => {
                if (val === '') {
                    options.value = stringOptions
                }
                else {
                    const needle = val.toLowerCase()
                    options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
                }
            },

            // "ref" is the Vue reference to the QSelect
            ref => {
                if (val !== '' && ref.options.length > 0) {
                    ref.setOptionIndex(-1) // reset optionIndex in case there is something selected
                    ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
                }
            }
        )
    }, 300)
}


function filterFnAutoselect(val, update, abort) {
    setTimeout(() => {
        update(
            () => {
                if (val === '') {
                    options.value = stringOptions
                }
                else {
                    const needle = val.toLowerCase()
                    options.value = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
                }
            },

            // "ref" is the Vue reference to the QSelect
            ref => {
                if (val !== '' && ref.options.length > 0 && ref.getOptionIndex() === -1) {
                    ref.moveOptionSelection(1, true) // focus the first selectable option and do not update the input-value
                    ref.toggleOption(ref.options[ref.optionIndex], true) // toggle the focused option
                }
            }
        )
    }, 300)
}


function abortFilterFn() {
    // console.log('delayed filter aborted')
}
</script>

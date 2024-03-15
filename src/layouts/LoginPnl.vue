<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex flex-center login-bg">
                <q-form @submit="login" class="q-gutter-md">
                    <q-input v-bind="viewLogin.acct" v-model.trim="viewLogin.acct.value" lazy-rules style="width:260px">
                        <template #prepend>
                            <q-icon name="person"></q-icon>
                        </template>
                    </q-input>
                    <q-input v-bind="viewLogin.passwd" v-model.trim="viewLogin.passwd.value" lazy-rules style="width:260px">
                        <template #prepend>
                            <q-icon name="password"></q-icon>
                        </template>
                    </q-input>

                    <q-btn v-bind="viewLogin.btn_login" style="width:260px"></q-btn>
                </q-form>
            </q-page>
        </q-page-container>
    </q-layout>
</template>


<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar';
import { DMOBJ } from 'src/boot/dm';
import { encryptString } from 'src/boot/security';
import { useI18n } from "vue-i18n"

const {t} = useI18n();
const dm = new DMOBJ(useQuasar(), useRouter());


const model = {
    acct:{label:t('account'),rules: [val => val && val.length > 0 || t('msgRequired')]},
    passwd:{label:t('password'),type:"password",rules: [val => val && val.length > 0 || t('msgRequired')]},
}

const viewLogin = ref({
    acct:model.acct,
    passwd:model.passwd,
    btn_login:{ label: ref(t('login')), color: 'primary', type: 'submit'},
})

function login(){
    let res = viewLogin.value;
    dm.post(
        '/user/login',
        {
            acct:res.acct.value,
            passwd:encryptString(res.passwd.value),
        },
        res.btn_login,
        (rsp)=>{
            localStorage.setItem('jwt',rsp.data['jwt'])
            dm.router.push('/')
        },
    )
}

</script>

<style scoped>
.login-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background-image: linear-gradient(180deg, #3b41c5 0%, #a981bb 49%, #ffc8a9 100%) */
    background-image: linear-gradient(180deg, #a8edea 0%, #fed6e3 100%)
}
</style>
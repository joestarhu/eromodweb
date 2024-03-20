<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex flex-center login-bg">
                <q-card flat style="background-color: rgba(255, 255, 255, 0.3);">
                    <q-card-section>
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
            </q-card-section>
            </q-card>
            </q-page>
        </q-page-container>
    </q-layout>
</template>


<script setup>
import { useI18n } from "vue-i18n"
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { modelUser } from 'src/boot/model';
import { DMOBJ } from 'src/boot/dm';
import { encryptString } from 'src/boot/security';

const {t} = useI18n();
const dm = new DMOBJ(useQuasar(), useRouter());

const viewLogin = ref({
    acct:{...modelUser.acct,rules: [val => val && val.length > 0 || t('msgRequired')]},
    passwd:{...modelUser.passwd,type:'password',rules: [val => val && val.length > 0 || t('msgRequired')]},
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
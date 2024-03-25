<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex flex-center login-bg">
                <q-card bordered class="login-card">
                    <q-card-section class="row">
                        <span class="text-h6 col">{{ actPnl.res.title }}</span>
                        <q-btn dense flat color="primary" @click="logout" v-if="actPnl.res.title == actRes.org.title"
                            class='row reverse'>返回登录</q-btn>
                    </q-card-section>

                    <q-card-section v-if="actPnl.res.title == actRes.account.title">
                        <q-form @submit="login">
                            <q-input v-bind="viewLogin.acct" v-model.trim="viewLogin.acct.value" lazy-rules
                                style="width:300px">
                                <template #prepend>
                                    <q-icon name="person"></q-icon>
                                </template>
                            </q-input>
                            <q-input v-bind="viewLogin.passwd" v-model.trim="viewLogin.passwd.value" lazy-rules
                                style="width:300px">
                                <template #prepend>
                                    <q-icon name="password"></q-icon>
                                </template>
                            </q-input>
                            <q-btn v-bind="viewLogin.btn_login" style="width:300px"></q-btn>
                        </q-form>
                    </q-card-section>

                    <q-card-section v-if="actPnl.res.title == actRes.org.title">
                        <q-scroll-area style="height: 250px;" visible v-if="userOrgs.length != 0">
                            <q-list bordered separator>
                                <q-item clickable v-ripple @click="orgChoice(org.id)" v-for="org in userOrgs"
                                    :key="org">
                                    <q-item-section avatar><q-avatar icon="o_public"></q-avatar></q-item-section>
                                    <q-item-section>{{ org.name }}</q-item-section>
                                </q-item>
                            </q-list>
                        </q-scroll-area>
                        <span class="flex flex-center text-grey-8" style="height: 250px;" v-else>无组织数据</span>
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
import { ref, onMounted } from 'vue';
import { modelUser } from 'src/boot/model';
import { DMOBJ } from 'src/boot/dm';
import { encryptString, getLoginOrg, getUserOrgs } from 'src/boot/security';

const { t } = useI18n();
const dm = new DMOBJ(useQuasar(), useRouter());

const viewLogin = ref({
    acct: { ...modelUser.acct, rules: [val => val && val.length > 0 || t('msgRequired')] },
    passwd: { ...modelUser.passwd, type: 'password', rules: [val => val && val.length > 0 || t('msgRequired')] },
    btn_login: { label: ref(t('login')), color: 'primary', type: 'submit' },
})


const actRes = {
    account: {
        title: '登录',
    },
    org: {
        title: '请选择组织',
    }
}

const actPnl = ref({
    res: actRes.account
})

const userOrgs = ref([])

function logout() {
    viewLogin.value.acct.value = ''
    viewLogin.value.passwd.value = ''
    actPnl.value.res = actRes.account
    localStorage.removeItem('jwt')
}

function login() {
    let res = viewLogin.value;
    let data = {
        acct: res.acct.value,
        passwd: encryptString(res.passwd.value),
    }

    dm.post('/auth/login', data, res.btn_login,
        (rsp) => {
            let jwt = rsp.data['jwt']
            localStorage.setItem('jwt', jwt)

            if (getLoginOrg(jwt) != null) {
                dm.router.push('/')
            } else {
                userOrgs.value = getUserOrgs(jwt)
                actPnl.value.res = actRes.org
            }
        },
    )
}

function orgChoice(orgID) {
    dm.post('/auth/select_org', { org_id: orgID }, null, (rsp) => {
        let jwt = rsp.data['jwt']
        localStorage.setItem('jwt', jwt)
        dm.router.push('/')
    })
}

onMounted(() => {
    let jwt = localStorage.getItem('jwt')
    if (jwt != null) {
        actPnl.value.res = actRes.org
        userOrgs.value = getUserOrgs(jwt)
    }
})

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

.login-card {
    background-color: rgba(255, 255, 255, 0.3);
    width: 330px;
    height: 350px;
}
</style>
<template>
    <q-layout>
        <q-page-container>
            <q-page class="flex flex-center login-bg">
                <q-form @submit="login">
                    <q-input v-bind="data.acct" v-model.trim="data.acct.value" lazy-rules>
                        <template #prepend>
                            <q-icon name="person"></q-icon>
                        </template>
                    </q-input>
                    <q-input v-bind="data.passwd" v-model.trim="data.passwd.value" lazy-rules>
                        <template #prepend>
                            <q-icon name="password"></q-icon>
                        </template>
                    </q-input>

                    <q-btn color="primary" type="sumbit">{{ $t("login") }}</q-btn>
                </q-form>
            </q-page>
        </q-page-container>
    </q-layout>
</template>


<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar';
import { DMOBJ } from 'src/boot/dm'


export default defineComponent({
    name: 'pLogin',
    setup() {
        const dm = new DMOBJ(useQuasar())
        const $router = useRouter()

        const data = ref({
            acct: { label: '账号', value: '', rules: [val => val && val.length > 0 || '请输入账号'] },
            passwd: { label: '密码', value: '', type: 'password', rules: [val => val && val.length > 0 || '请输入密码'] },
        })

        async function login() {
            // let encrypt_str = encryptString(data.value.passwd.value)
            // let rsp = await dm.post('/user/login', { acct: data.value.acct.value, passwd: encrypt_str })
            // if (rsp.data.code == 0) {
            //     localStorage.setItem('jwt', rsp.data.data['jwt'])
            //     $router.push('/')
            // }
            localStorage.setItem('jwt', 'dummy-jwt')
            $router.push('/')
        }

        return {
            data,
            login,
        }
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
    background-image: linear-gradient(0deg, #a8edea 0%, #fed6e3 100%)
}
</style>
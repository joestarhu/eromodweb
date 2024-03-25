<template>
  <q-layout view="hHh Lpr lFf">
    <!-- <q-header elevated> -->
    <q-header bordered class="dm-header">
      <q-toolbar>
        <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" /> -->
        <q-toolbar-title class="text-bold text-white">
          EROMOD
        </q-toolbar-title>

        <q-avatar class="dm-avatar" text-color="white" color="info">
          <img :src=userInfo.avatar />
          <!-- <img :src=userInfo.avatar v-if="userInfo.avatar != ''" /> -->
          <!-- <span v-else>{{ userInfo.nick_name[0] }}</span> -->
          <q-popup-proxy>
            <q-list dense>

              <q-item clickable>
                <q-item-section>
                  <span>{{ userInfo.nick_name }}</span>
                </q-item-section>
              </q-item>
              <q-separator />

              <q-item clickable v-close-popup @click="logout">
                <q-item-section>
                  <q-item-label>{{ $t("logout") }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-popup-proxy>
        </q-avatar>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <dm_menu v-for="obj in data" :key="obj" v-bind="obj"></dm_menu>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { DMOBJ } from 'src/boot/dm'
import { getJwtPayload } from 'src/boot/security'
import dm_menu from 'components/dmMenu.vue'


export default defineComponent({
  name: 'MainLayout',

  components: {
    dm_menu,
  },

  setup() {
    const dm = new DMOBJ(useQuasar(), useRouter())
    const leftDrawerOpen = ref(false)
    const userInfo = ref({
      nick_name: 'Nick Name',
      avatar: 'https://demos.pixinvent.com/materialize-vuejs-admin-template/demo-2/assets/avatar-1-08a2c8d8.png',
    })
    const data = [
      {
        title: '平台服务', children: [
          { title: '账户管理', to: '/acct', icon: 'o_account_box' },
          { title: '组织管理', to: '/org', icon: 'o_corporate_fare' },
          { title: '应用管理', to: '/service', icon: 'api' },
          // { title: '用户管理', to: '/user', icon: 'account_box' },
          // { title: '角色管理', to: '/role', icon: 'label' },

        ]
      },
      // {
      //   title: '数据可视化', children: [
      //     { title: 'Echarts', to: '/service', icon: 'bar_chart' },
      //   ],
      // }
    ]

    function logout() {
      dm.logout()
    }


    function get_user_info() {
      // 从JWT中获取用户信息
      let payload = getJwtPayload(localStorage.getItem('jwt'))
      userInfo.value.nick_name = payload['nick_name']
    }


    onMounted(() => {
      get_user_info()
    })


    return {
      data,
      leftDrawerOpen,
      userInfo,
      logout,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }

    }
  }
})
</script>


<style scoped>
.dm-header {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* background-image:linear-gradient(135deg,#0ba360 0%, #3cba92 100%) */
  /* background-image:linear-gradient(135deg,#764ba2 0%, #667eea 100%); */
}

.dm-avatar {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>

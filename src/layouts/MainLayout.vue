<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-white">
        <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title class="text-bold" style="color: #34373c;">
          EROMOD
        </q-toolbar-title>

        <q-avatar class="dm-avatar" text-color="white" color="info">
          <img :src=userInfo.avatar v-if="userInfo.avatar != ''" />
          <span v-else>{{ userInfo.nick_name[0] }}</span>
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
      nick_name: '获取用户名失败',
      avatar: '',
    })
    const data = [
      {
        title: '统一用户中心服务', children: [
          { title: '用户管理', to: '/user', icon: 'account_box' },
          { title: '组织管理', to: '/org', icon: 'account_tree' },
          { title: '角色管理', to: '/role', icon: 'label' },
          { title: '服务管理', to: '/service', icon: 'pix' },
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
      dm.get('/user/login_user', null, (rsp) => {
        userInfo.value.nick_name = rsp.data['nick_name']
        userInfo.value.avatar = rsp.data['avatar']
      })
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
.dm-avatar {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
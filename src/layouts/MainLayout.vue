<template>
  <q-layout view="hHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          EROMOD
        </q-toolbar-title>

        <q-avatar class="dm-avatar">
          <img src="https://cdn.quasar.dev/img/avatar4.jpg" />
          <q-popup-proxy>
            <q-list dense>
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import dm_menu from 'components/dmMenu.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    dm_menu,
  },

  setup() {
    const $router = useRouter()
    const leftDrawerOpen = ref(false)
    const data = [
      {
        title: '统一用户中心服务', children: [
          { title: '用户管理', to: '/user', icon: 'person' },
          { title: '组织管理', to: '/org', icon: 'lan' },
          // { title: '角色管理', to: '/role', icon: 'group' },
          // { title: '租户管理', to: '/tenant', icon: 'tenant' },
        ]
      }
    ]

    function logout() {
      localStorage.removeItem('jwt')
      $router.push('/login')
    }


    return {
      data,
      leftDrawerOpen,
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
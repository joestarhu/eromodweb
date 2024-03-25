import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { getLoginOrg } from 'src/boot/security';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // 路由守护(登录路由守护)
  Router.beforeEach((to, from, next) => {
    let jwt = localStorage.getItem('jwt')

    if (jwt == null) {
      if (to.path === '/login') {
        // 未登录前往登录界面
        next()
      } else {
        // 未登录前往非登录界面以外界面
        next('/login')
      }
    } else {
      let login_org = getLoginOrg(jwt)
      if (login_org == null) {
        if (to.path === '/login') {
          // 未登录前往登录界面
          next()
        } else {
          // 未登录前往非登录界面以外界面
          next('/login')
        }
      } else {
        if (to.path === '/login') {
          next('/')
        } else {
          next()
        }
      }
    }

  })

  return Router
})

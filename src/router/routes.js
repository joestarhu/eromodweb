
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },

      { path: '/acct', component: () => import('pages/UserCenter/AccountManager.vue') },
      { path: '/org', component: () => import('pages/UserCenter/OrgManager.vue') },
      { path: '/service', component: () => import('pages/UserCenter/AppServices.vue') },


      { path: '/role', component: () => import('pages/UserCenter/RoleManager.vue') },


    ]
  },
  {
    path: '/login',
    component: () => import('layouts/LoginPnl.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

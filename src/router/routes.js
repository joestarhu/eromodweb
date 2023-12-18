
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/user', component: () => import('pages/UserCenter/User.vue') },
      { path: '/org', component: () => import('pages/UserCenter/Org.vue') },
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/Login.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

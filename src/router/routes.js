
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '',                     component: () => import('pages/Home.vue') },
      { path: '/drop/:dropId',        component: () => import('pages/DropPage.vue'), name: 'Drop' },
      { path: '/item/:itemId',        component: () => import('pages/ItemPage.vue'), name: 'Item' },
      { path: '/account',             component: () => import('pages/User/AccountPage.vue') },
      { path: '/auth/login',          component: () => import('pages/AuthPage.vue'), name: 'Login'   },
      { path: '/auth/register',       component: () => import('pages/AuthPage.vue'), name: 'Register' },
      { path: '/auth/forgot',         component: () => import('pages/ForgotPasswordPage.vue'), name: 'ForgotPassword' },
      { path: '/admin/drops',         component: () => import('pages/Admin/DropsAdminPage.vue') },
      { path: '/admin/items/:dropId', component: () => import('pages/Admin/ItemsAdminPage.vue') },
      { path: '/admin/invoices',      component: () => import('pages/Admin/InvoicesAdminPage.vue') },
      { path: '/admin/users',         component: () => import('pages/Admin/UsersAdminPage.vue') },
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

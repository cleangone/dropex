
const routes = [
  {
    path: '/',
    component: () => import('layouts/Layout.vue'),
    children: [
      { path: '', component: () => import('pages/Home.vue') },
      { path: '/drop/:dropId',  component: () => import('pages/DropPage.vue'), name: 'Drop' },
      { path: '/account',       component: () => import('pages/User/AccountPage.vue') },
      { path: '/invoice',       component: () => import('pages/Admin/InvoicePage.vue') },
      { path: '/users',         component: () => import('pages/Admin/UsersPage.vue') },
      { path: '/auth/login',    component: () => import('pages/AuthPage.vue'), name: 'Login'   },
      { path: '/auth/register', component: () => import('pages/AuthPage.vue'), name: 'Register' },
      { path: '/auth/forgot',   component: () => import('pages/ForgotPasswordPage.vue'), name: 'ForgotPassword' }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

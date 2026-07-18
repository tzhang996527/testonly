import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
      },
      // Project
      {
        path: 'project',
        name: 'ProjectList',
        component: () => import('@/views/project/ProjectList.vue'),
      },
      {
        path: 'project/create',
        name: 'ProjectCreate',
        component: () => import('@/views/project/ProjectForm.vue'),
      },
      {
        path: 'project/:id',
        name: 'ProjectDetail',
        component: () => import('@/views/project/ProjectDetail.vue'),
        children: [
          { path: '', redirect: 'overview' },
          { path: 'overview', name: 'ProjectOverview', component: () => import('@/views/project/tabs/Overview.vue') },
          { path: 'pre-work', name: 'PreWork', component: () => import('@/views/project/tabs/PreWork.vue') },
          { path: 'inventory', name: 'Inventory', component: () => import('@/views/project/tabs/Inventory.vue') },
          { path: 'collection', name: 'Collection', component: () => import('@/views/project/tabs/Collection.vue') },
          { path: 'estimation', name: 'Estimation', component: () => import('@/views/project/tabs/Estimation.vue') },
          { path: 'review', name: 'Review', component: () => import('@/views/project/tabs/ReviewApproval.vue') },
          { path: 'confirmation', name: 'Confirmation', component: () => import('@/views/project/tabs/Confirmation.vue') },
          { path: 'archive', name: 'Archive', component: () => import('@/views/project/tabs/Archive.vue') },
          { path: 'tracking', name: 'Tracking', component: () => import('@/views/project/tabs/Tracking.vue') },
        ],
      },
      // Assets
      {
        path: 'assets',
        name: 'Assets',
        component: () => import('@/views/assets/AssetList.vue'),
      },
      // Reports
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/ReportCenter.vue'),
      },
      // Admin
      {
        path: 'admin/users',
        name: 'UserManage',
        component: () => import('@/views/admin/UserManage.vue'),
      },
      {
        path: 'admin/roles',
        name: 'RoleManage',
        component: () => import('@/views/admin/RoleManage.vue'),
      },
      {
        path: 'admin/flow-config',
        name: 'FlowConfig',
        component: () => import('@/views/admin/FlowConfig.vue'),
      },
      {
        path: 'admin/config',
        name: 'ConfigCenter',
        component: () => import('@/views/admin/ConfigCenter.vue'),
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth !== false && !auth.isLoggedIn) {
    return '/login'
  }
  if (to.path === '/login' && auth.isLoggedIn) {
    return '/'
  }
})

export default router

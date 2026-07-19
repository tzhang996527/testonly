import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { PERM } from '@/constants/permissions.js'

// permId: the permission ID required to access the route (undefined = any logged-in user)
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
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
      // Project
      { path: 'project',        name: 'ProjectList',   component: () => import('@/views/project/ProjectList.vue'),  meta: { permId: PERM.PROJECT_VIEW } },
      { path: 'project/create', name: 'ProjectCreate', component: () => import('@/views/project/ProjectForm.vue'),  meta: { permId: PERM.PROJECT_CREATE } },
      {
        path: 'project/:id',
        name: 'ProjectDetail',
        component: () => import('@/views/project/ProjectDetail.vue'),
        meta: { permId: PERM.PROJECT_VIEW },
        children: [
          { path: '', redirect: 'overview' },
          { path: 'overview',     name: 'ProjectOverview', component: () => import('@/views/project/tabs/Overview.vue') },
          { path: 'pre-work',     name: 'PreWork',         component: () => import('@/views/project/tabs/PreWork.vue') },
          { path: 'inventory',    name: 'Inventory',       component: () => import('@/views/project/tabs/Inventory.vue') },
          { path: 'collection',   name: 'Collection',      component: () => import('@/views/project/tabs/Collection.vue') },
          { path: 'estimation',   name: 'Estimation',      component: () => import('@/views/project/tabs/Estimation.vue') },
          { path: 'review',       name: 'Review',          component: () => import('@/views/project/tabs/ReviewApproval.vue') },
          { path: 'confirmation', name: 'Confirmation',    component: () => import('@/views/project/tabs/Confirmation.vue') },
          { path: 'archive',      name: 'Archive',         component: () => import('@/views/project/tabs/Archive.vue') },
          { path: 'tracking',     name: 'Tracking',        component: () => import('@/views/project/tabs/Tracking.vue') },
        ],
      },
      // Assets
      { path: 'assets',  name: 'Assets',  component: () => import('@/views/assets/AssetList.vue'),        meta: { permId: PERM.ASSETS_VIEW } },
      // Reports
      { path: 'reports', name: 'Reports', component: () => import('@/views/reports/ReportCenter.vue'), meta: { permId: PERM.REPORTS_VIEW } },
      // Admin — require specific permission IDs
      { path: 'admin/users',       name: 'UserManage',   component: () => import('@/views/admin/UserManage.vue'),   meta: { permId: PERM.ADMIN_USERS } },
      { path: 'admin/roles',       name: 'RoleManage',   component: () => import('@/views/admin/RoleManage.vue'),   meta: { permId: PERM.ADMIN_ROLES } },
      { path: 'admin/flow-config', name: 'FlowConfig',   component: () => import('@/views/admin/FlowConfig.vue'),   meta: { permId: PERM.ADMIN_FLOW } },
      { path: 'admin/config',      name: 'ConfigCenter', component: () => import('@/views/admin/ConfigCenter.vue'), meta: { adminOnly: true } },
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

  if (to.meta.requiresAuth === false) {
    if (auth.isLoggedIn) return '/'
    return true
  }

  if (!auth.isLoggedIn) return '/login'

  // admin-only pages
  if (to.meta.adminOnly && !auth.isAdmin) return '/dashboard'

  // permission-gated pages (admin bypasses all)
  const permId = to.meta.permId
  if (permId && !auth.hasPerm(permId)) return '/dashboard'

  return true
})

export default router

import { defineStore } from 'pinia'
import { userApi } from '@/api/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:        JSON.parse(localStorage.getItem('user') || 'null'),
    token:       localStorage.getItem('token') || '',
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]'),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName:   (state) => state.user?.name || '',
    userRoles:  (state) => state.user?.roles || [],
    userRole:   (state) => (state.user?.roles || [])[0] || '',  // legacy compat
    isAdmin:    (state) => (state.user?.roles || []).includes('admin'),
    hasPerm:    (state) => (permId) =>
      (state.user?.roles || []).includes('admin') || state.permissions.includes(permId),
  },

  actions: {
    async login(username, password) {
      const res = await userApi.login(username, password)
      const { permissions, token, ...user } = res.data
      this.user        = user
      this.token       = token
      this.permissions = permissions || []
      localStorage.setItem('user',        JSON.stringify(user))
      localStorage.setItem('token',       token)
      localStorage.setItem('permissions', JSON.stringify(this.permissions))
    },

    logout() {
      this.user        = null
      this.token       = ''
      this.permissions = []
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      localStorage.removeItem('permissions')
    },
  },
})

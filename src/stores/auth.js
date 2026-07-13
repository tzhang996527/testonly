import { defineStore } from 'pinia'
import { userApi } from '@/api/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.user?.name || '',
    userRole: (state) => state.user?.role || '',
  },

  actions: {
    async login(username, password) {
      const res = await userApi.login(username, password)
      this.user = res.data
      this.token = res.data.token
      localStorage.setItem('user', JSON.stringify(res.data))
      localStorage.setItem('token', res.data.token)
    },

    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})

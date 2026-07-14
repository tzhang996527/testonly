import { defineStore } from 'pinia'
import { projectApi } from '@/api/index.js'

// mock API returns the same object reference every time, so we must
// deep-clone to get a new reference that Vue's reactivity system detects
function fresh(data) {
  return JSON.parse(JSON.stringify(data))
}

export const useProjectStore = defineStore('project', {
  state: () => ({
    list: [],
    total: 0,
    current: null,
    loading: false,
  }),

  actions: {
    async fetchList(params) {
      this.loading = true
      try {
        const res = await projectApi.list(params)
        this.list = res.data
        this.total = res.total
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      try {
        const res = await projectApi.get(id)
        this.current = fresh(res.data)
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      const res = await projectApi.create(payload)
      this.list.unshift(res.data)
      return res.data
    },

    async update(id, payload) {
      const res = await projectApi.update(id, payload)
      const idx = this.list.findIndex(p => p.id === id)
      if (idx !== -1) this.list[idx] = fresh(res.data)
      if (this.current?.id === id) this.current = fresh(res.data)
      return res.data
    },

    async approve(id, approvalData) {
      const res = await projectApi.approve(id, approvalData)
      if (this.current?.id === id) this.current = fresh(res.data)
      return res.data
    },

    async savePreWorkInfo(id, payload) {
      const res = await projectApi.savePreWorkInfo(id, payload)
      if (this.current?.id === id) this.current = fresh(res.data)
      return res.data
    },

    async approvePreWork(id, approvalData) {
      const res = await projectApi.approvePreWork(id, approvalData)
      if (this.current?.id === id) this.current = fresh(res.data)
      return res.data
    },

    async saveReviewInfo(id, payload) {
      const res = await projectApi.saveReviewInfo(id, payload)
      if (this.current?.id === id) this.current = fresh(res.data)
      return res.data
    },

    async approveReview(id, approvalData) {
      const res = await projectApi.approveReview(id, approvalData)
      if (this.current?.id === id) this.current = fresh(res.data)
      return res.data
    },

    async advanceStep(id) {
      const res = await projectApi.advanceStep(id)
      if (this.current?.id === id) this.current = fresh(res.data)
      const idx = this.list.findIndex(p => p.id === id)
      if (idx !== -1) this.list[idx] = fresh(res.data)
      return res.data
    },
  },
})

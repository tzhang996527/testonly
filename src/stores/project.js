import { defineStore } from 'pinia'
import { projectApi, approvalsApi } from '@/api/index.js'

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

    async remove(id) {
      await projectApi.remove(id)
      this.list = this.list.filter(p => p.id !== id)
      if (this.current?.id === id) this.current = null
    },

    // ── Approvals (all stages) ──────────────────────────────

    // Fetch nodes for a single stage and merge into current.approvalsByStage
    async fetchStageApprovals(projectId, stage) {
      const res = await approvalsApi.list(projectId, stage)
      if (this.current?.id === projectId) {
        if (!this.current.approvalsByStage) this.current.approvalsByStage = {}
        this.current.approvalsByStage[stage] = fresh(res.data)
      }
      return res.data
    },

    // Save (replace) flow for a stage
    async saveStageFlow(projectId, stage, flow) {
      const res = await approvalsApi.save(projectId, stage, flow)
      if (this.current?.id === projectId) {
        if (!this.current.approvalsByStage) this.current.approvalsByStage = {}
        this.current.approvalsByStage[stage] = fresh(res.data)
      }
      return res.data
    },

    // Approve a node within a stage
    async approveStage(projectId, stage, approvalData) {
      const res = await approvalsApi.approve(projectId, stage, approvalData)
      if (this.current?.id === projectId) {
        if (!this.current.approvalsByStage) this.current.approvalsByStage = {}
        this.current.approvalsByStage[stage] = fresh(res.data)
      }
      return res.data
    },

    // ── Legacy helpers used by PreWork / ReviewApproval tabs ──

    async savePreWorkInfo(id, payload) {
      const res = await projectApi.savePreWorkInfo(id, payload)
      if (this.current?.id === id) this.current = fresh(res.data)
      return res.data
    },

    async saveReviewInfo(id, payload) {
      const res = await projectApi.saveReviewInfo(id, payload)
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

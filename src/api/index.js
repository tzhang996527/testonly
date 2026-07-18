import axios from 'axios'
import { mockRoles } from '@/api/mockData.js'

const http = axios.create({ baseURL: '/api' })

// attach JWT token to every request
http.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
})

// redirect to login on 401
http.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

function delay(ms = 300) { return new Promise(r => setTimeout(r, ms)) }

// ── Projects ──────────────────────────────────────────────
export const projectApi = {
  list: (params = {})       => http.get('/projects', { params }).then(r => r.data),
  get:  (id)                => http.get(`/projects/${id}`).then(r => r.data),
  create: (payload)         => http.post('/projects', payload).then(r => r.data),
  update: (id, payload)     => http.patch(`/projects/${id}`, payload).then(r => r.data),
  remove: (id)              => http.delete(`/projects/${id}`).then(r => r.data),

  savePreWorkInfo:(id, data) => http.post(`/projects/${id}/save-prework`, data).then(r => r.data),
  saveReviewInfo: (id, data) => http.post(`/projects/${id}/save-review`, data).then(r => r.data),
  advanceStep:    (id)       => http.post(`/projects/${id}/advance-step`).then(r => r.data),
}

// ── Approvals ─────────────────────────────────────────────
export const approvalsApi = {
  list:    (projectId, stage)        => http.get(`/approvals/${projectId}/${stage}`).then(r => r.data),
  save:    (projectId, stage, flow)  => http.put(`/approvals/${projectId}/${stage}`, flow).then(r => r.data),
  approve: (projectId, stage, data)  => http.post(`/approvals/${projectId}/${stage}/approve`, data).then(r => r.data),
}

// ── Assets ──────────────────────────────────────────────
export const assetApi = {
  list:   (params = {}) => http.get('/assets', { params }).then(r => r.data),
  create: (payload)     => http.post('/assets', payload).then(r => r.data),
  update: (id, payload) => http.patch(`/assets/${id}`, payload).then(r => r.data),
}

// ── Inventory ──────────────────────────────────────────────
export const inventoryApi = {
  list:   (projectId)   => http.get(`/inventory/${projectId}`).then(r => r.data),
  update: (id, payload) => http.patch(`/inventory/${id}`, payload).then(r => r.data),
}

// ── Stages ─────────────────────────────────────────────────
export const stagesApi = {
  get:    (projectId, stage)         => http.get(`/stages/${projectId}/${stage}`).then(r => r.data),
  save:   (projectId, stage, data)   => http.put(`/stages/${projectId}/${stage}`, data).then(r => r.data),
  // tracking records
  listTracking:   (projectId)        => http.get(`/stages/${projectId}/tracking`).then(r => r.data),
  addTracking:    (projectId, data)  => http.post(`/stages/${projectId}/tracking`, data).then(r => r.data),
  deleteTracking: (projectId, id)    => http.delete(`/stages/${projectId}/tracking/${id}`).then(r => r.data),
}

// ── Documents ──────────────────────────────────────────────
export const documentApi = {
  list: (projectId, stage) => http.get(`/documents/${projectId}`, { params: stage ? { stage } : {} }).then(r => r.data),

  async upload(projectId, file, stage, category, uploadedBy = '当前用户') {
    const form = new FormData()
    form.append('file', file)
    form.append('projectId', projectId)
    form.append('stage', stage)
    form.append('category', category)
    form.append('uploadedBy', uploadedBy)
    return http.post('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  remove: (id) => http.delete(`/documents/${id}`).then(r => r.data),

  fileUrl: (storedName) => `/uploads/${storedName}`,
}

// ── Users ──────────────────────────────────────────────
export const userApi = {
  list:          ()          => http.get('/users').then(r => r.data),
  create:        (data)      => http.post('/users', data).then(r => r.data),
  update:        (id, data)  => http.patch(`/users/${id}`, data).then(r => r.data),
  resetPassword: (id, pwd)   => http.post(`/users/${id}/reset-password`, { password: pwd }).then(r => r.data),

  async login(username, password) {
    return http.post('/users/login', { username, password }).then(r => r.data)
  },
}

// ── Roles ──────────────────────────────────────────────
export const roleApi = {
  async list() {
    await delay()
    return { data: [...mockRoles] }
  },

  async create(payload) {
    await delay(400)
    const newRole = {
      ...payload,
      key: payload.key || payload.label.toLowerCase().replace(/\s+/g, ''),
    }
    mockRoles.push(newRole)
    return { data: newRole }
  },

  async remove(key) {
    await delay(300)
    const idx = mockRoles.findIndex(r => r.key === key)
    if (idx === -1) throw new Error('角色不存在')
    mockRoles.splice(idx, 1)
    return { data: { key } }
  },
}

// ── Dashboard ──────────────────────────────────────────────
export const dashboardApi = {
  get: () => http.get('/dashboard').then(r => r.data),
}

import axios from 'axios'

const http = axios.create({ baseURL: '/api' })

// ── Projects ──────────────────────────────────────────────
export const projectApi = {
  list: (params = {})       => http.get('/projects', { params }).then(r => r.data),
  get:  (id)                => http.get(`/projects/${id}`).then(r => r.data),
  create: (payload)         => http.post('/projects', payload).then(r => r.data),
  update: (id, payload)     => http.patch(`/projects/${id}`, payload).then(r => r.data),
  remove: (id)              => http.delete(`/projects/${id}`).then(r => r.data),

  approve:       (id, data) => http.post(`/projects/${id}/approve`, data).then(r => r.data),
  approvePreWork:(id, data) => http.post(`/projects/${id}/approve-prework`, data).then(r => r.data),
  savePreWorkInfo:(id, data)=> http.post(`/projects/${id}/save-prework`, data).then(r => r.data),
  saveReviewInfo:(id, data) => http.post(`/projects/${id}/save-review`, data).then(r => r.data),
  approveReview: (id, data) => http.post(`/projects/${id}/approve-review`, data).then(r => r.data),
  advanceStep:   (id)       => http.post(`/projects/${id}/advance-step`).then(r => r.data),
}

// ── Assets ──────────────────────────────────────────────
export const assetApi = {
  list:   (params = {}) => http.get('/assets', { params }).then(r => r.data),
  create: (payload)     => http.post('/assets', payload).then(r => r.data),
  update: (id, payload) => http.patch(`/assets/${id}`, payload).then(r => r.data),
}

// ── Inventory ──────────────────────────────────────────────
export const inventoryApi = {
  list:   (projectId)       => http.get(`/inventory/${projectId}`).then(r => r.data),
  update: (id, payload)     => http.patch(`/inventory/${id}`, payload).then(r => r.data),
}

// ── Documents ──────────────────────────────────────────────
export const documentApi = {
  list: (projectId) => http.get(`/documents/${projectId}`).then(r => r.data),

  // Upload a real File object via multipart/form-data
  async upload(projectId, file, category, uploadedBy = '当前用户') {
    const form = new FormData()
    form.append('file', file)
    form.append('projectId', projectId)
    form.append('category', category)
    form.append('uploadedBy', uploadedBy)
    return http.post('/documents/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data)
  },

  remove: (id) => http.delete(`/documents/${id}`).then(r => r.data),

  // Build a download/preview URL for a stored file
  fileUrl: (storedName) => `/uploads/${storedName}`,
}

// ── Users ──────────────────────────────────────────────
export const userApi = {
  async list() {
    await delay()
    return { data: mockUsers, total: mockUsers.length }
  },

  async login(username, password) {
    await delay(600)
    const user = mockUsers.find(u => u.username === username)
    if (!user || password !== '123456') throw new Error('用户名或密码错误')
    return { data: { ...user, token: 'mock-token-' + user.id } }
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

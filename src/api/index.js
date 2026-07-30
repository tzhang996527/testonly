import axios from 'axios'

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
  list:             ()              => http.get('/roles').then(r => r.data),
  create:           (data)          => http.post('/roles', data).then(r => r.data),
  update:           (key, data)     => http.patch(`/roles/${key}`, data).then(r => r.data),
  remove:           (key)           => http.delete(`/roles/${key}`).then(r => r.data),
  savePermissions:  (key, perms)    => http.patch(`/roles/${key}`, { permissions: perms }).then(r => r.data),
}

// ── Flow Configs ────────────────────────────────────────────
export const flowConfigApi = {
  list:        ()         => http.get('/flow-configs').then(r => r.data),
  listEnabled: ()         => http.get('/flow-configs/enabled').then(r => r.data),
  create:      (data)     => http.post('/flow-configs', data).then(r => r.data),
  update:      (id, data) => http.patch(`/flow-configs/${id}`, data).then(r => r.data),
  remove:      (id)       => http.delete(`/flow-configs/${id}`).then(r => r.data),
}

// ── Config ──────────────────────────────────────────────
export const configApi = {
  // purposes
  listPurposes:   ()         => http.get('/config/purposes').then(r => r.data),
  createPurpose:  (data)     => http.post('/config/purposes', data).then(r => r.data),
  updatePurpose:  (id, data) => http.patch(`/config/purposes/${id}`, data).then(r => r.data),
  deletePurpose:  (id)       => http.delete(`/config/purposes/${id}`).then(r => r.data),
  // methods
  listMethods:    ()         => http.get('/config/methods').then(r => r.data),
  createMethod:   (data)     => http.post('/config/methods', data).then(r => r.data),
  updateMethod:   (id, data) => http.patch(`/config/methods/${id}`, data).then(r => r.data),
  deleteMethod:   (id)       => http.delete(`/config/methods/${id}`).then(r => r.data),
}

// ── Dashboard ──────────────────────────────────────────────
export const dashboardApi = {
  get: () => http.get('/dashboard').then(r => r.data),
}

// ── Change Logs ──────────────────────────────────────────────
export const changeLogApi = {
  list:   (params = {}) => http.get('/change-logs', { params }).then(r => r.data),
  get:    (id)          => http.get(`/change-logs/${id}`).then(r => r.data),
  remove: (id)          => http.delete(`/change-logs/${id}`).then(r => r.data),
}

// ── Work Log ──────────────────────────────────────────────────
export const worklogApi = {
  listWeeks:      (params = {})      => http.get('/worklog/weeks', { params }).then(r => r.data),
  getWeek:        (id)               => http.get(`/worklog/weeks/${id}`).then(r => r.data),
  getCurrentWeek: (params = {})      => http.get('/worklog/current', { params }).then(r => r.data),
  getWeekByDate:  (params = {})      => http.get('/worklog/week-by-date', { params }).then(r => r.data),
  saveWeekNotes:  (id, data)         => http.put(`/worklog/weeks/${id}`, data).then(r => r.data),
  getOverview:    (params = {})      => http.get('/worklog/overview', { params }).then(r => r.data),
  getProjectHours:(projectId)        => http.get(`/worklog/project-hours/${projectId}`).then(r => r.data),

  addEntry:    (data)      => http.post('/worklog/entries', data).then(r => r.data),
  updateEntry: (id, data)  => http.patch(`/worklog/entries/${id}`, data).then(r => r.data),
  deleteEntry: (id)        => http.delete(`/worklog/entries/${id}`).then(r => r.data),
}

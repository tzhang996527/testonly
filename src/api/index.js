import { mockProjects, mockAssets, mockUsers, mockInventoryItems, mockDocuments, mockDashboard } from './mockData.js'

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// ── Projects ──────────────────────────────────────────────
export const projectApi = {
  async list(params = {}) {
    await delay()
    let data = [...mockProjects]
    if (params.status) data = data.filter(p => p.status === params.status)
    if (params.keyword) data = data.filter(p =>
      p.projectNo.includes(params.keyword) || p.purpose.includes(params.keyword)
    )
    return { data, total: data.length }
  },

  async get(id) {
    await delay()
    const item = mockProjects.find(p => p.id === id)
    if (!item) throw new Error('Project not found')
    return { data: item }
  },

  async create(payload) {
    await delay(500)
    // payload.approvalFlow = [{ role, approvers: [{name, username}] }]
    const defaultFlow = [
      { role: '部门负责人', approvers: [{ name: '李经理', username: 'li.manager' }] },
      { role: '风控',       approvers: [{ name: '王风控', username: 'wang.riskctrl' }] },
      { role: '办公室',     approvers: [{ name: '办公室主任', username: 'office.chief' }] },
      { role: '总经理',     approvers: [{ name: '陈总', username: 'chen.ceo' }] },
    ]
    const flowDef = payload.approvalFlow || defaultFlow
    const newProject = {
      ...payload,
      id: String(mockProjects.length + 1),
      projectNo: `PJ-${new Date().getFullYear()}-${String(mockProjects.length + 1).padStart(4, '0')}`,
      status: 'draft',
      currentStep: 1,
      createdAt: new Date().toLocaleString('zh-CN'),
      approvals: flowDef.map(node => ({
        role: node.role,
        nodeStatus: 'pending',
        approvers: node.approvers.map(p => ({
          name: p.name,
          username: p.username,
          status: 'pending',
          comment: '',
          time: '',
        })),
      })),
    }
    mockProjects.push(newProject)
    return { data: newProject }
  },

  async update(id, payload) {
    await delay(400)
    const idx = mockProjects.findIndex(p => p.id === id)
    if (idx === -1) throw new Error('Project not found')
    Object.assign(mockProjects[idx], payload)
    return { data: mockProjects[idx] }
  },

  async approve(id, approvalData) {
    await delay(400)
    const project = mockProjects.find(p => p.id === id)
    if (!project) throw new Error('Project not found')
    const node = project.approvals.find(a => a.role === approvalData.role)
    if (node) {
      // 按 username 找到当前审批人并更新其状态
      const person = node.approvers.find(a => a.username === approvalData.username)
      if (person) {
        person.status = approvalData.action
        person.comment = approvalData.comment
        person.time = new Date().toLocaleString('zh-CN')
      }
      // 任意一人通过 → 节点通过；所有人都驳回 → 节点驳回
      if (node.approvers.some(a => a.status === 'approved')) {
        node.nodeStatus = 'approved'
      } else if (node.approvers.every(a => a.status === 'rejected')) {
        node.nodeStatus = 'rejected'
      } else {
        node.nodeStatus = 'pending'
      }
    }
    const allApproved = project.approvals.every(a => a.nodeStatus === 'approved')
    if (allApproved) project.status = 'approved'
    return { data: project }
  },

  async advanceStep(id) {
    await delay(300)
    const project = mockProjects.find(p => p.id === id)
    if (project && project.currentStep < 9) {
      project.currentStep += 1
      const stepStatuses = ['draft', 'inProgress', 'inProgress', 'inProgress', 'inProgress', 'reviewing', 'confirmed', 'archived', 'archived']
      project.status = stepStatuses[project.currentStep - 1] || project.status
    }
    return { data: project }
  },
}

// ── Assets ──────────────────────────────────────────────
export const assetApi = {
  async list(params = {}) {
    await delay()
    let data = [...mockAssets]
    if (params.projectId) data = data.filter(a => a.projectId === params.projectId)
    if (params.keyword) data = data.filter(a =>
      a.assetNo.includes(params.keyword) || a.assetName.includes(params.keyword)
    )
    return { data, total: data.length }
  },

  async create(payload) {
    await delay(400)
    const item = { ...payload, id: String(mockAssets.length + 1) }
    mockAssets.push(item)
    return { data: item }
  },

  async update(id, payload) {
    await delay(400)
    const idx = mockAssets.findIndex(a => a.id === id)
    if (idx !== -1) Object.assign(mockAssets[idx], payload)
    return { data: mockAssets[idx] }
  },
}

// ── Inventory ──────────────────────────────────────────────
export const inventoryApi = {
  async list(projectId) {
    await delay()
    return { data: mockInventoryItems.filter(i => i.projectId === projectId) }
  },

  async update(id, payload) {
    await delay(400)
    const idx = mockInventoryItems.findIndex(i => i.id === id)
    if (idx !== -1) Object.assign(mockInventoryItems[idx], payload)
    return { data: mockInventoryItems[idx] }
  },
}

// ── Documents ──────────────────────────────────────────────
export const documentApi = {
  async list(projectId) {
    await delay()
    return { data: mockDocuments.filter(d => d.projectId === projectId) }
  },

  async upload(projectId, fileData) {
    await delay(800)
    const doc = {
      ...fileData,
      id: String(mockDocuments.length + 1),
      projectId,
      uploadedAt: new Date().toLocaleString('zh-CN'),
      status: 'pending',
    }
    mockDocuments.push(doc)
    return { data: doc }
  },
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

// ── Dashboard ──────────────────────────────────────────────
export const dashboardApi = {
  async get() {
    await delay()
    return { data: mockDashboard }
  },
}

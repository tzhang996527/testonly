import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../db/index.js'
import { projects, documents, approvalNodes, stagePreWork, stageReview } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../../uploads')

const router = Router()

function parse(row) {
  if (!row) return null
  return { ...row }
}

function json(col) { return JSON.stringify(col) }

async function loadApprovals(projectId) {
  const rows = await db.select().from(approvalNodes).where(eq(approvalNodes.projectId, projectId))
  const byStage = {}
  for (const row of rows) {
    if (!byStage[row.stage]) byStage[row.stage] = []
    byStage[row.stage].push({ ...row, approvers: JSON.parse(row.approvers || '[]') })
  }
  for (const stage of Object.keys(byStage)) {
    byStage[stage].sort((a, b) => a.nodeIndex - b.nodeIndex)
  }
  return byStage
}

// GET /api/projects
router.get('/', async (req, res) => {
  const { status, keyword } = req.query
  let rows = await db.select().from(projects)
  if (status)  rows = rows.filter(p => p.status === status)
  if (keyword) rows = rows.filter(p => p.projectNo.includes(keyword) || p.purpose.includes(keyword))
  res.json({ data: rows.map(parse), total: rows.length })
})

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const approvals = await loadApprovals(req.params.id)
  res.json({ data: { ...parse(row), approvalsByStage: approvals } })
})

// POST /api/projects
router.post('/', async (req, res) => {
  const payload = req.body
  const allRows = await db.select().from(projects)
  const newId = String(allRows.length + 1)
  const year = new Date().getFullYear()
  const projectNo = `PJ-${year}-${String(allRows.length + 1).padStart(4, '0')}`
  const now = new Date().toLocaleString('zh-CN')
  const newProject = {
    id: newId, projectNo, status: 'draft', currentStep: 1, createdAt: now,
    purpose: payload.purpose, baseDate: payload.baseDate,
    assetCategory: payload.assetCategory, responsible: payload.responsible,
    department: payload.department, remark: payload.remark || '',
  }
  await db.insert(projects).values(newProject)

  // create overview approval_nodes
  const defaultFlow = [
    { role: '部门负责人', approvers: [{ name: '李经理', username: 'li.manager' }] },
    { role: '风控',       approvers: [{ name: '王风控', username: 'wang.riskctrl' }] },
    { role: '办公室',     approvers: [{ name: '办公室主任', username: 'office.chief' }] },
    { role: '总经理',     approvers: [{ name: '陈总', username: 'chen.ceo' }] },
  ]
  const flowDef = payload.approvalFlow || defaultFlow
  const allNodes = await db.select().from(approvalNodes)
  let nextNodeId = allNodes.length + 1
  for (let i = 0; i < flowDef.length; i++) {
    const node = flowDef[i]
    await db.insert(approvalNodes).values({
      id: String(nextNodeId++), projectId: newId, stage: 'overview',
      nodeIndex: i, role: node.role, nodeStatus: 'pending',
      approvers: json(node.approvers.map(p => ({ ...p, status: 'pending', comment: '', time: '' }))),
    })
  }

  const approvals = await loadApprovals(newId)
  res.json({ data: { ...parse(newProject), approvalsByStage: approvals } })
})

// PATCH /api/projects/:id
router.patch('/:id', async (req, res) => {
  const [existing] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!existing) return res.status(404).json({ message: 'Not found' })
  await db.update(projects).set(req.body).where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  const approvals = await loadApprovals(req.params.id)
  res.json({ data: { ...parse(updated), approvalsByStage: approvals } })
})

// POST /api/projects/:id/save-prework — upserts stage_pre_work + replaces approval nodes
router.post('/:id/save-prework', async (req, res) => {
  const { form, approvalFlow } = req.body
  const now = new Date().toLocaleString('zh-CN')

  // if any pre-work approval node has already been acted on, refuse to reset
  const existingNodes = await db.select().from(approvalNodes).where(
    and(eq(approvalNodes.projectId, req.params.id), eq(approvalNodes.stage, 'pre-work'))
  )
  const inProgress = existingNodes.some(n => n.nodeStatus !== 'pending' ||
    JSON.parse(n.approvers || '[]').some(a => a.status !== 'pending'))
  if (inProgress) {
    return res.status(409).json({ message: '审批已在进行中，不可重新提交' })
  }

  const payload = {
    ...form,
    projectId:  req.params.id,
    members:    json(form?.members   || []),
    erpStatus:  json(form?.erpStatus || []),
    updatedAt:  now,
  }

  const [existing] = await db.select().from(stagePreWork).where(eq(stagePreWork.projectId, req.params.id))
  if (existing) {
    const { projectId: _, ...updates } = payload
    await db.update(stagePreWork).set(updates).where(eq(stagePreWork.projectId, req.params.id))
  } else {
    await db.insert(stagePreWork).values(payload)
  }
  await db.delete(approvalNodes).where(
    and(eq(approvalNodes.projectId, req.params.id), eq(approvalNodes.stage, 'pre-work'))
  )
  const allNodes = await db.select().from(approvalNodes)
  let nextNodeId = allNodes.length + 1
  for (let i = 0; i < (approvalFlow || []).length; i++) {
    const node = approvalFlow[i]
    await db.insert(approvalNodes).values({
      id: String(nextNodeId++), projectId: req.params.id, stage: 'pre-work',
      nodeIndex: i, role: node.role, nodeStatus: 'pending',
      approvers: json(node.approvers.map(p => ({ ...p, status: 'pending', comment: '', time: '' }))),
    })
  }

  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  const approvals = await loadApprovals(req.params.id)
  res.json({ data: { ...parse(row), approvalsByStage: approvals } })
})

// POST /api/projects/:id/save-review — upserts stage_review + replaces approval nodes
router.post('/:id/save-review', async (req, res) => {
  const { approvalFlow, erpStatus } = req.body
  const now = new Date().toLocaleString('zh-CN')

  const existingNodes = await db.select().from(approvalNodes).where(
    and(eq(approvalNodes.projectId, req.params.id), eq(approvalNodes.stage, 'review'))
  )
  const inProgress = existingNodes.some(n => n.nodeStatus !== 'pending' ||
    JSON.parse(n.approvers || '[]').some(a => a.status !== 'pending'))
  if (inProgress) {
    return res.status(409).json({ message: '审批已在进行中，不可重新提交' })
  }
  const payload = { projectId: req.params.id, erpStatus: json(erpStatus || []), updatedAt: now }

  const [existing] = await db.select().from(stageReview).where(eq(stageReview.projectId, req.params.id))
  if (existing) {
    await db.update(stageReview).set({ erpStatus: payload.erpStatus, updatedAt: now })
      .where(eq(stageReview.projectId, req.params.id))
  } else {
    await db.insert(stageReview).values(payload)
  }

  await db.delete(approvalNodes).where(
    and(eq(approvalNodes.projectId, req.params.id), eq(approvalNodes.stage, 'review'))
  )
  const allNodes = await db.select().from(approvalNodes)
  let nextNodeId = allNodes.length + 1
  for (let i = 0; i < (approvalFlow || []).length; i++) {
    const node = approvalFlow[i]
    await db.insert(approvalNodes).values({
      id: String(nextNodeId++), projectId: req.params.id, stage: 'review',
      nodeIndex: i, role: node.role, nodeStatus: 'pending',
      approvers: json(node.approvers.map(p => ({ ...p, status: 'pending', comment: '', time: '' }))),
    })
  }

  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  const approvals = await loadApprovals(req.params.id)
  res.json({ data: { ...parse(row), approvalsByStage: approvals } })
})

// POST /api/projects/:id/advance-step
router.post('/:id/advance-step', async (req, res) => {
  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const stepStatuses = ['draft','inProgress','inProgress','inProgress','inProgress','reviewing','confirmed','archived','archived']
  const nextStep = Math.min((row.currentStep || 1) + 1, 9)
  const status = stepStatuses[nextStep - 1] || row.status
  await db.update(projects).set({ currentStep: nextStep, status }).where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  const approvals = await loadApprovals(req.params.id)
  res.json({ data: { ...parse(updated), approvalsByStage: approvals } })
})

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  const [existing] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!existing) return res.status(404).json({ message: 'Not found' })

  const docs = await db.select().from(documents).where(eq(documents.projectId, req.params.id))
  for (const doc of docs) {
    if (doc.storedName) fs.unlink(path.join(UPLOADS_DIR, doc.storedName), () => {})
  }
  await db.delete(documents).where(eq(documents.projectId, req.params.id))
  await db.delete(approvalNodes).where(eq(approvalNodes.projectId, req.params.id))
  await db.delete(projects).where(eq(projects.id, req.params.id))
  res.json({ success: true })
})

export default router

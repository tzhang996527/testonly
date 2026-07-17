import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../db/index.js'
import { projects, documents } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../../uploads')

const router = Router()

// helpers
function parse(row) {
  if (!row) return null
  return {
    ...row,
    approvals:        JSON.parse(row.approvals        || '[]'),
    preWorkApprovals: JSON.parse(row.preWorkApprovals || '[]'),
    reviewApprovals:  JSON.parse(row.reviewApprovals  || '[]'),
    preWorkData:      JSON.parse(row.preWorkData      || '{}'),
    reviewErpStatus:  JSON.parse(row.reviewErpStatus  || '[]'),
    attachments:      JSON.parse(row.attachments      || '{}'),
  }
}

function json(col) { return JSON.stringify(col) }

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
  res.json({ data: parse(row) })
})

// POST /api/projects
router.post('/', async (req, res) => {
  const payload = req.body
  const allRows = await db.select().from(projects)
  const newId = String(allRows.length + 1)
  const defaultFlow = [
    { role: '部门负责人', approvers: [{ name: '李经理', username: 'li.manager' }] },
    { role: '风控',       approvers: [{ name: '王风控', username: 'wang.riskctrl' }] },
    { role: '办公室',     approvers: [{ name: '办公室主任', username: 'office.chief' }] },
    { role: '总经理',     approvers: [{ name: '陈总', username: 'chen.ceo' }] },
  ]
  const flowDef = payload.approvalFlow || defaultFlow
  const approvals = flowDef.map(node => ({
    role: node.role, nodeStatus: 'pending',
    approvers: node.approvers.map(p => ({ ...p, status: 'pending', comment: '', time: '' })),
  }))
  const year = new Date().getFullYear()
  const projectNo = `PJ-${year}-${String(allRows.length + 1).padStart(4, '0')}`
  const now = new Date().toLocaleString('zh-CN')
  const newProject = {
    id: newId, projectNo, status: 'draft', currentStep: 1, createdAt: now,
    purpose: payload.purpose, baseDate: payload.baseDate,
    assetCategory: payload.assetCategory, responsible: payload.responsible,
    department: payload.department, remark: payload.remark || '',
    approvals: json(approvals),
    preWorkApprovals: json([]),
    reviewApprovals:  json([]),
    preWorkData:      json({}),
    reviewErpStatus:  json([]),
    attachments:      json(payload.attachments || {}),
  }
  await db.insert(projects).values(newProject)
  res.json({ data: parse(newProject) })
})

// PATCH /api/projects/:id
router.patch('/:id', async (req, res) => {
  const [existing] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!existing) return res.status(404).json({ message: 'Not found' })
  await db.update(projects).set(req.body).where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  res.json({ data: parse(updated) })
})

// POST /api/projects/:id/approve
router.post('/:id/approve', async (req, res) => {
  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const parsed = parse(row)
  const { role, username, action, comment } = req.body
  const node = parsed.approvals.find(a => a.role === role)
  if (node) {
    const person = node.approvers.find(a => a.username === username)
    if (person) { person.status = action; person.comment = comment; person.time = new Date().toLocaleString('zh-CN') }
    node.nodeStatus = node.approvers.some(a => a.status === 'approved') ? 'approved'
      : node.approvers.every(a => a.status === 'rejected') ? 'rejected' : 'pending'
  }
  if (parsed.approvals.every(a => a.nodeStatus === 'approved')) parsed.status = 'approved'
  await db.update(projects).set({ approvals: json(parsed.approvals), status: parsed.status })
    .where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  res.json({ data: parse(updated) })
})

// POST /api/projects/:id/approve-prework
router.post('/:id/approve-prework', async (req, res) => {
  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const parsed = parse(row)
  const { role, username, action, comment } = req.body
  const node = parsed.preWorkApprovals.find(a => a.role === role)
  if (node) {
    const person = node.approvers.find(a => a.username === username)
    if (person) { person.status = action; person.comment = comment; person.time = new Date().toLocaleString('zh-CN') }
    node.nodeStatus = node.approvers.some(a => a.status === 'approved') ? 'approved'
      : node.approvers.every(a => a.status === 'rejected') ? 'rejected' : 'pending'
  }
  await db.update(projects).set({ preWorkApprovals: json(parsed.preWorkApprovals) })
    .where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  res.json({ data: parse(updated) })
})

// POST /api/projects/:id/save-prework
router.post('/:id/save-prework', async (req, res) => {
  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const { form, approvalFlow } = req.body
  const preWorkApprovals = (approvalFlow || []).map(node => ({
    role: node.role, nodeStatus: 'pending',
    approvers: node.approvers.map(p => ({ ...p, status: 'pending', comment: '', time: '' })),
  }))
  await db.update(projects)
    .set({ preWorkData: json(form || {}), preWorkApprovals: json(preWorkApprovals) })
    .where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  res.json({ data: parse(updated) })
})

// POST /api/projects/:id/save-review
router.post('/:id/save-review', async (req, res) => {
  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const { approvalFlow, erpStatus } = req.body
  const reviewApprovals = (approvalFlow || []).map(node => ({
    role: node.role, nodeStatus: 'pending',
    approvers: node.approvers.map(p => ({ ...p, status: 'pending', comment: '', time: '' })),
  }))
  await db.update(projects)
    .set({ reviewApprovals: json(reviewApprovals), reviewErpStatus: json(erpStatus || []) })
    .where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  res.json({ data: parse(updated) })
})

// POST /api/projects/:id/approve-review
router.post('/:id/approve-review', async (req, res) => {
  const [row] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const parsed = parse(row)
  const { role, username, action, comment } = req.body
  const node = parsed.reviewApprovals.find(a => a.role === role)
  if (node) {
    const person = node.approvers.find(a => a.username === username)
    if (person) { person.status = action; person.comment = comment; person.time = new Date().toLocaleString('zh-CN') }
    node.nodeStatus = node.approvers.some(a => a.status === 'approved') ? 'approved'
      : node.approvers.every(a => a.status === 'rejected') ? 'rejected' : 'pending'
  }
  await db.update(projects).set({ reviewApprovals: json(parsed.reviewApprovals) })
    .where(eq(projects.id, req.params.id))
  const [updated] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  res.json({ data: parse(updated) })
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
  res.json({ data: parse(updated) })
})

// DELETE /api/projects/:id
router.delete('/:id', async (req, res) => {
  const [existing] = await db.select().from(projects).where(eq(projects.id, req.params.id))
  if (!existing) return res.status(404).json({ message: 'Not found' })

  // delete associated files from disk and documents table
  const docs = await db.select().from(documents).where(eq(documents.projectId, req.params.id))
  for (const doc of docs) {
    if (doc.storedName) {
      const filePath = path.join(UPLOADS_DIR, doc.storedName)
      fs.unlink(filePath, () => {}) // ignore error if file already gone
    }
  }
  await db.delete(documents).where(eq(documents.projectId, req.params.id))

  await db.delete(projects).where(eq(projects.id, req.params.id))
  res.json({ success: true })
})

export default router

import { Router } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import { experts } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

function now() {
  return new Date().toLocaleString('zh-CN')
}

// GET /api/experts  — list all
router.get('/', async (req, res) => {
  const rows = await db.select().from(experts)
  rows.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
  res.json({ data: rows })
})

// GET /api/experts/:id
router.get('/:id', async (req, res) => {
  const [row] = await db.select().from(experts).where(eq(experts.id, req.params.id))
  if (!row) return res.status(404).json({ message: '未找到记录' })
  res.json({ data: row })
})

// POST /api/experts
router.post('/', async (req, res) => {
  const payload = {
    ...req.body,
    id: randomUUID(),
    createdAt: now(),
    updatedAt: now(),
    createdBy: req.user?.name || '',
  }
  await db.insert(experts).values(payload)
  const [row] = await db.select().from(experts).where(eq(experts.id, payload.id))
  res.status(201).json({ data: row })
})

// PUT /api/experts/:id
router.put('/:id', async (req, res) => {
  const [existing] = await db.select().from(experts).where(eq(experts.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '未找到记录' })

  const { id, createdAt, createdBy, ...updates } = req.body
  await db.update(experts)
    .set({ ...updates, updatedAt: now() })
    .where(eq(experts.id, req.params.id))

  const [row] = await db.select().from(experts).where(eq(experts.id, req.params.id))
  res.json({ data: row })
})

// DELETE /api/experts/:id
router.delete('/:id', async (req, res) => {
  const [existing] = await db.select().from(experts).where(eq(experts.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '未找到记录' })
  await db.delete(experts).where(eq(experts.id, req.params.id))
  res.json({ message: '已删除' })
})

export default router

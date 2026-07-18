import { Router } from 'express'
import { db } from '../db/index.js'
import { assessmentPurposes, assessmentMethods } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

function nextId(rows) {
  const nums = rows.map(r => parseInt(r.id.replace(/\D/g, ''), 10)).filter(n => !isNaN(n))
  return String((nums.length ? Math.max(...nums) : 0) + 1)
}

// ── Assessment Purposes ───────────────────────────────────────────────────────

router.get('/purposes', async (req, res) => {
  const rows = await db.select().from(assessmentPurposes).orderBy(assessmentPurposes.sortOrder)
  res.json({ data: rows })
})

router.post('/purposes', async (req, res) => {
  const rows = await db.select().from(assessmentPurposes)
  const id = 'ap-' + nextId(rows)
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), 0)
  const item = { id, name: req.body.name, sortOrder: maxOrder + 1, enabled: 1 }
  await db.insert(assessmentPurposes).values(item)
  res.json({ data: item })
})

router.patch('/purposes/:id', async (req, res) => {
  await db.update(assessmentPurposes).set(req.body).where(eq(assessmentPurposes.id, req.params.id))
  const [row] = await db.select().from(assessmentPurposes).where(eq(assessmentPurposes.id, req.params.id))
  res.json({ data: row })
})

router.delete('/purposes/:id', async (req, res) => {
  await db.delete(assessmentPurposes).where(eq(assessmentPurposes.id, req.params.id))
  res.json({ success: true })
})

// ── Assessment Methods ────────────────────────────────────────────────────────

router.get('/methods', async (req, res) => {
  const rows = await db.select().from(assessmentMethods).orderBy(assessmentMethods.sortOrder)
  res.json({ data: rows })
})

router.post('/methods', async (req, res) => {
  const rows = await db.select().from(assessmentMethods)
  const id = 'am-' + nextId(rows)
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), 0)
  const item = { id, name: req.body.name, sortOrder: maxOrder + 1, enabled: 1 }
  await db.insert(assessmentMethods).values(item)
  res.json({ data: item })
})

router.patch('/methods/:id', async (req, res) => {
  await db.update(assessmentMethods).set(req.body).where(eq(assessmentMethods.id, req.params.id))
  const [row] = await db.select().from(assessmentMethods).where(eq(assessmentMethods.id, req.params.id))
  res.json({ data: row })
})

router.delete('/methods/:id', async (req, res) => {
  await db.delete(assessmentMethods).where(eq(assessmentMethods.id, req.params.id))
  res.json({ success: true })
})

export default router

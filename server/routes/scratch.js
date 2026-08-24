import { Router } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import { scratchG1, scratchG2, scratchG28, scratchG4, scratchG5 } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const router = Router()

function now() {
  return new Date().toLocaleString('zh-CN')
}

// ── G-1 ──────────────────────────────────────────────────────────────────────

// GET /api/scratch/g1/:projectId/:stage
router.get('/g1/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG1)
    .where(and(eq(scratchG1.projectId, projectId), eq(scratchG1.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/g1/:projectId/:stage
router.put('/g1/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG1)
    .where(and(eq(scratchG1.projectId, projectId), eq(scratchG1.stage, stage)))

  const { id: _id, ...fields } = req.body
  if (existing) {
    await db.update(scratchG1)
      .set({ ...fields, updatedAt: now() })
      .where(eq(scratchG1.id, existing.id))
    const [row] = await db.select().from(scratchG1).where(eq(scratchG1.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG1).values({ ...fields, id: newId, projectId, stage, updatedAt: now() })
  const [row] = await db.select().from(scratchG1).where(eq(scratchG1.id, newId))
  res.status(201).json({ data: row })
})

// ── G-2 ──────────────────────────────────────────────────────────────────────

// GET /api/scratch/g2/:projectId/:stage
router.get('/g2/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG2)
    .where(and(eq(scratchG2.projectId, projectId), eq(scratchG2.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/g2/:projectId/:stage
router.put('/g2/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG2)
    .where(and(eq(scratchG2.projectId, projectId), eq(scratchG2.stage, stage)))

  const { id: _id, ...fields } = req.body
  if (existing) {
    await db.update(scratchG2)
      .set({ ...fields, updatedAt: now() })
      .where(eq(scratchG2.id, existing.id))
    const [row] = await db.select().from(scratchG2).where(eq(scratchG2.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG2).values({ ...fields, id: newId, projectId, stage, updatedAt: now() })
  const [row] = await db.select().from(scratchG2).where(eq(scratchG2.id, newId))
  res.status(201).json({ data: row })
})

// ── G-28 ─────────────────────────────────────────────────────────────────────

// GET /api/scratch/g28/:projectId/:stage  — all members
router.get('/g28/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const rows = await db.select().from(scratchG28)
    .where(and(eq(scratchG28.projectId, projectId), eq(scratchG28.stage, stage)))
  res.json({ data: rows })
})

// POST /api/scratch/g28/:projectId/:stage  — add member
router.post('/g28/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const { id: _id, ...fields } = req.body
  const newId = randomUUID()
  await db.insert(scratchG28).values({
    ...fields, id: newId, projectId, stage,
    createdAt: now(), updatedAt: now(),
  })
  const [row] = await db.select().from(scratchG28).where(eq(scratchG28.id, newId))
  res.status(201).json({ data: row })
})

// PUT /api/scratch/g28/:id  — update member
router.put('/g28/:id', async (req, res) => {
  const [existing] = await db.select().from(scratchG28).where(eq(scratchG28.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '未找到记录' })
  const { id: _id, projectId: _pid, stage: _s, createdAt: _c, ...fields } = req.body
  await db.update(scratchG28)
    .set({ ...fields, updatedAt: now() })
    .where(eq(scratchG28.id, req.params.id))
  const [row] = await db.select().from(scratchG28).where(eq(scratchG28.id, req.params.id))
  res.json({ data: row })
})

// DELETE /api/scratch/g28/:id
router.delete('/g28/:id', async (req, res) => {
  const [existing] = await db.select().from(scratchG28).where(eq(scratchG28.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '未找到记录' })
  await db.delete(scratchG28).where(eq(scratchG28.id, req.params.id))
  res.json({ message: '已删除' })
})

// ── G-4 ──────────────────────────────────────────────────────────────────────

router.get('/g4/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG4)
    .where(and(eq(scratchG4.projectId, projectId), eq(scratchG4.stage, stage)))
  res.json({ data: row || null })
})

router.put('/g4/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG4)
    .where(and(eq(scratchG4.projectId, projectId), eq(scratchG4.stage, stage)))

  const body = req.body
  const fields = {
    projectName:    body.projectName    || '',
    purpose:        body.purpose        || '',
    baseDate:       body.baseDate       || '',
    valueType:      body.valueType      || '',
    scope:          body.scope          || '',
    schedule:       JSON.stringify(body.schedule  || []),
    staff:          JSON.stringify(body.staff     || []),
    budget:         JSON.stringify(body.budget    || {}),
    approver:       body.approver       || '',
    approveDate:    body.approveDate    || '',
    adjustment:     body.adjustment     || '',
    adjustApprover: body.adjustApprover || '',
    adjustDate:     body.adjustDate     || '',
    remark:         body.remark         || '',
    preparer:       body.preparer       || '',
    reviewer:       body.reviewer       || '',
    updatedAt:      now(),
  }
  if (existing) {
    await db.update(scratchG4).set(fields).where(eq(scratchG4.id, existing.id))
    const [row] = await db.select().from(scratchG4).where(eq(scratchG4.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG4).values({ ...fields, id: newId, projectId, stage })
  const [row] = await db.select().from(scratchG4).where(eq(scratchG4.id, newId))
  res.status(201).json({ data: row })
})

// ── G-5 ──────────────────────────────────────────────────────────────────────

router.get('/g5/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG5)
    .where(and(eq(scratchG5.projectId, projectId), eq(scratchG5.stage, stage)))
  res.json({ data: row || null })
})

router.put('/g5/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG5)
    .where(and(eq(scratchG5.projectId, projectId), eq(scratchG5.stage, stage)))

  const fields = { items: req.body.items || '[]', updatedAt: now() }
  if (existing) {
    await db.update(scratchG5).set(fields).where(eq(scratchG5.id, existing.id))
    const [row] = await db.select().from(scratchG5).where(eq(scratchG5.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG5).values({ ...fields, id: newId, projectId, stage })
  const [row] = await db.select().from(scratchG5).where(eq(scratchG5.id, newId))
  res.status(201).json({ data: row })
})

export default router

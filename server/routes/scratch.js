import { Router } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import { scratchG1, scratchG2, scratchG28, scratchG4, scratchG5, scratchG27, scratchC3, scratchG10, scratchG11, scratchG12, scratchEstimationMethods, scratchInvSheet } from '../db/schema.js'
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

// ── G-27 现场勘查记录表 ───────────────────────────────────────────────────────

// GET /api/scratch/g27/:projectId/:stage
router.get('/g27/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG27)
    .where(and(eq(scratchG27.projectId, projectId), eq(scratchG27.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/g27/:projectId/:stage
router.put('/g27/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG27)
    .where(and(eq(scratchG27.projectId, projectId), eq(scratchG27.stage, stage)))

  const { id: _id, projectId: _pid, stage: _s, ...fields } = req.body
  if (existing) {
    await db.update(scratchG27)
      .set({ ...fields, updatedAt: now() })
      .where(eq(scratchG27.id, existing.id))
    const [row] = await db.select().from(scratchG27).where(eq(scratchG27.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG27).values({ ...fields, id: newId, projectId, stage, updatedAt: now() })
  const [row] = await db.select().from(scratchG27).where(eq(scratchG27.id, newId))
  res.status(201).json({ data: row })
})

// ── C3-1-1/2 库存现金作业分析表 ───────────────────────────────────────────────

// GET /api/scratch/c3/:projectId/:stage
router.get('/c3/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchC3)
    .where(and(eq(scratchC3.projectId, projectId), eq(scratchC3.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/c3/:projectId/:stage
router.put('/c3/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchC3)
    .where(and(eq(scratchC3.projectId, projectId), eq(scratchC3.stage, stage)))

  const { id: _id, projectId: _pid, stage: _s, ...fields } = req.body
  if (existing) {
    await db.update(scratchC3)
      .set({ ...fields, updatedAt: now() })
      .where(eq(scratchC3.id, existing.id))
    const [row] = await db.select().from(scratchC3).where(eq(scratchC3.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchC3).values({ ...fields, id: newId, projectId, stage, updatedAt: now() })
  const [row] = await db.select().from(scratchC3).where(eq(scratchC3.id, newId))
  res.status(201).json({ data: row })
})

// ── G-10 评估报告审核表 ───────────────────────────────────────────────────────

// GET /api/scratch/g10/:projectId/:stage
router.get('/g10/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG10)
    .where(and(eq(scratchG10.projectId, projectId), eq(scratchG10.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/g10/:projectId/:stage
router.put('/g10/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG10)
    .where(and(eq(scratchG10.projectId, projectId), eq(scratchG10.stage, stage)))

  const { id: _id, projectId: _pid, stage: _s, ...fields } = req.body
  if (existing) {
    await db.update(scratchG10)
      .set({ ...fields, updatedAt: now() })
      .where(eq(scratchG10.id, existing.id))
    const [row] = await db.select().from(scratchG10).where(eq(scratchG10.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG10).values({ ...fields, id: newId, projectId, stage, updatedAt: now() })
  const [row] = await db.select().from(scratchG10).where(eq(scratchG10.id, newId))
  res.status(201).json({ data: row })
})

// ── G-11 评估报告签发表 ───────────────────────────────────────────────────────

// GET /api/scratch/g11/:projectId/:stage
router.get('/g11/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG11)
    .where(and(eq(scratchG11.projectId, projectId), eq(scratchG11.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/g11/:projectId/:stage
router.put('/g11/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG11)
    .where(and(eq(scratchG11.projectId, projectId), eq(scratchG11.stage, stage)))

  const { id: _id, projectId: _pid, stage: _s, ...fields } = req.body
  if (existing) {
    await db.update(scratchG11)
      .set({ ...fields, updatedAt: now() })
      .where(eq(scratchG11.id, existing.id))
    const [row] = await db.select().from(scratchG11).where(eq(scratchG11.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG11).values({ ...fields, id: newId, projectId, stage, updatedAt: now() })
  const [row] = await db.select().from(scratchG11).where(eq(scratchG11.id, newId))
  res.status(201).json({ data: row })
})

// ── G-12 评估报告签收单 ───────────────────────────────────────────────────────

// GET /api/scratch/g12/:projectId/:stage
router.get('/g12/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchG12)
    .where(and(eq(scratchG12.projectId, projectId), eq(scratchG12.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/g12/:projectId/:stage
router.put('/g12/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchG12)
    .where(and(eq(scratchG12.projectId, projectId), eq(scratchG12.stage, stage)))

  const body = req.body
  const fields = {
    docName:       body.docName       || '',
    docNo:         body.docNo         || '',
    items:         JSON.stringify(body.items || []),
    receiveUnit:   body.receiveUnit   || '',
    receiveDate:   body.receiveDate   || '',
    delivererSign: body.delivererSign || '',
    deliverDate:   body.deliverDate   || '',
    updatedAt:     now(),
  }
  if (existing) {
    await db.update(scratchG12).set(fields).where(eq(scratchG12.id, existing.id))
    const [row] = await db.select().from(scratchG12).where(eq(scratchG12.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchG12).values({ ...fields, id: newId, projectId, stage })
  const [row] = await db.select().from(scratchG12).where(eq(scratchG12.id, newId))
  res.status(201).json({ data: row })
})

// ── 评估方法底稿文件确认 ─────────────────────────────────────────────────────

// GET /api/scratch/estimation-methods/:projectId/:stage
router.get('/estimation-methods/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [row] = await db.select().from(scratchEstimationMethods)
    .where(and(eq(scratchEstimationMethods.projectId, projectId), eq(scratchEstimationMethods.stage, stage)))
  res.json({ data: row || null })
})

// PUT /api/scratch/estimation-methods/:projectId/:stage
router.put('/estimation-methods/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const [existing] = await db.select().from(scratchEstimationMethods)
    .where(and(eq(scratchEstimationMethods.projectId, projectId), eq(scratchEstimationMethods.stage, stage)))

  const body = req.body
  const fields = {
    selectedMethods: JSON.stringify(body.selectedMethods || []),
    checksAssetBase: JSON.stringify(body.checksAssetBase || []),
    checksIncome:    JSON.stringify(body.checksIncome    || []),
    checksMarket:    JSON.stringify(body.checksMarket    || []),
    updatedAt:       now(),
  }
  if (existing) {
    await db.update(scratchEstimationMethods).set(fields).where(eq(scratchEstimationMethods.id, existing.id))
    const [row] = await db.select().from(scratchEstimationMethods).where(eq(scratchEstimationMethods.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchEstimationMethods).values({ ...fields, id: newId, projectId, stage })
  const [row] = await db.select().from(scratchEstimationMethods).where(eq(scratchEstimationMethods.id, newId))
  res.status(201).json({ data: row })
})

// ── 存货底稿表（通用，按 formKey 存 JSON）─────────────────────────────────────

// GET /api/scratch/inv-sheet/:projectId/:stage/:formKey
router.get('/inv-sheet/:projectId/:stage/:formKey', async (req, res) => {
  const { projectId, stage, formKey } = req.params
  const [row] = await db.select().from(scratchInvSheet)
    .where(and(
      eq(scratchInvSheet.projectId, projectId),
      eq(scratchInvSheet.stage, stage),
      eq(scratchInvSheet.formKey, formKey),
    ))
  res.json({ data: row || null })
})

// PUT /api/scratch/inv-sheet/:projectId/:stage/:formKey
router.put('/inv-sheet/:projectId/:stage/:formKey', async (req, res) => {
  const { projectId, stage, formKey } = req.params
  const [existing] = await db.select().from(scratchInvSheet)
    .where(and(
      eq(scratchInvSheet.projectId, projectId),
      eq(scratchInvSheet.stage, stage),
      eq(scratchInvSheet.formKey, formKey),
    ))

  const payload = JSON.stringify(req.body ?? {})
  if (existing) {
    await db.update(scratchInvSheet)
      .set({ payload, updatedAt: now() })
      .where(eq(scratchInvSheet.id, existing.id))
    const [row] = await db.select().from(scratchInvSheet).where(eq(scratchInvSheet.id, existing.id))
    return res.json({ data: row })
  }
  const newId = randomUUID()
  await db.insert(scratchInvSheet).values({ id: newId, projectId, stage, formKey, payload, updatedAt: now() })
  const [row] = await db.select().from(scratchInvSheet).where(eq(scratchInvSheet.id, newId))
  res.status(201).json({ data: row })
})

export default router

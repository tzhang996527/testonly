import { Router } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import {
  stagePreWork, stageInventory, stageCollection,
  stageEstimation, stageReview, stageConfirmation,
  stageArchive, trackingRecords,
} from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

// table and JSON columns per stage
const STAGE_CONFIG = {
  'pre-work':    { table: stagePreWork,    json: ['members', 'erpStatus'] },
  inventory:     { table: stageInventory,  json: ['erpStatus'] },
  collection:    { table: stageCollection, json: ['erpStatus'] },
  estimation:    { table: stageEstimation, json: ['erpStatus'] },
  review:        { table: stageReview,     json: ['erpStatus'] },
  confirmation:  { table: stageConfirmation, json: [] },
  archive:       { table: stageArchive,    json: [] },
}

function parseRow(row, jsonFields) {
  if (!row) return null
  const out = { ...row }
  for (const f of jsonFields) {
    if (typeof out[f] === 'string') {
      try { out[f] = JSON.parse(out[f]) } catch { out[f] = [] }
    }
  }
  return out
}

function serializePayload(payload, jsonFields) {
  const out = { ...payload }
  for (const f of jsonFields) {
    if (out[f] !== undefined && typeof out[f] !== 'string') {
      out[f] = JSON.stringify(out[f])
    }
  }
  return out
}

// GET /api/stages/:projectId/:stage
router.get('/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const cfg = STAGE_CONFIG[stage]
  if (!cfg) return res.status(404).json({ message: 'Unknown stage' })

  const [row] = await db.select().from(cfg.table).where(eq(cfg.table.projectId, projectId))
  res.json({ data: parseRow(row, cfg.json) })
})

// PUT /api/stages/:projectId/:stage  — upsert
router.put('/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const cfg = STAGE_CONFIG[stage]
  if (!cfg) return res.status(404).json({ message: 'Unknown stage' })

  const payload = serializePayload(
    { ...req.body, projectId, updatedAt: new Date().toLocaleString('zh-CN') },
    cfg.json,
  )

  const [existing] = await db.select().from(cfg.table).where(eq(cfg.table.projectId, projectId))
  if (existing) {
    const { projectId: _pid, ...updates } = payload
    await db.update(cfg.table).set(updates).where(eq(cfg.table.projectId, projectId))
  } else {
    await db.insert(cfg.table).values(payload)
  }

  const [updated] = await db.select().from(cfg.table).where(eq(cfg.table.projectId, projectId))
  res.json({ data: parseRow(updated, cfg.json) })
})

// ── Tracking records (multi-row) ─────────────────────────────────────────────

// GET /api/stages/:projectId/tracking
router.get('/:projectId/tracking', async (req, res) => {
  const rows = await db.select().from(trackingRecords)
    .where(eq(trackingRecords.projectId, req.params.projectId))
  rows.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  res.json({ data: rows })
})

// POST /api/stages/:projectId/tracking
router.post('/:projectId/tracking', async (req, res) => {
  const record = {
    id:        randomUUID(),
    projectId: req.params.projectId,
    type:      req.body.type     || 'other',
    date:      req.body.date     || '',
    content:   req.body.content  || '',
    recorder:  req.user?.name    || req.body.recorder || '当前用户',
    createdAt: new Date().toLocaleString('zh-CN'),
  }
  await db.insert(trackingRecords).values(record)
  res.json({ data: record })
})

// DELETE /api/stages/:projectId/tracking/:id
router.delete('/:projectId/tracking/:id', async (req, res) => {
  await db.delete(trackingRecords).where(eq(trackingRecords.id, req.params.id))
  res.json({ success: true })
})

export default router

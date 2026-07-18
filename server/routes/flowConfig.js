import { Router } from 'express'
import { db } from '../db/index.js'
import { flowConfigs } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

function parse(row) {
  if (!row) return null
  return { ...row, nodes: JSON.parse(row.nodes || '[]') }
}

function nextId(rows) {
  const nums = rows.map(r => parseInt(r.id.replace(/\D/g, ''), 10)).filter(n => !isNaN(n))
  return 'fc-' + ((nums.length ? Math.max(...nums) : 0) + 1)
}

// GET /api/flow-configs
router.get('/', async (req, res) => {
  const rows = await db.select().from(flowConfigs).orderBy(flowConfigs.sortOrder)
  res.json({ data: rows.map(parse) })
})

// GET /api/flow-configs/enabled  — lightweight list for selectors
router.get('/enabled', async (req, res) => {
  const rows = await db.select().from(flowConfigs).orderBy(flowConfigs.sortOrder)
  res.json({ data: rows.filter(r => r.enabled).map(parse) })
})

// POST /api/flow-configs
router.post('/', async (req, res) => {
  const rows = await db.select().from(flowConfigs)
  const id = nextId(rows)
  const maxOrder = rows.reduce((m, r) => Math.max(m, r.sortOrder), 0)
  const item = {
    id,
    name:      req.body.name,
    scene:     req.body.scene || '',
    nodes:     JSON.stringify(req.body.nodes || []),
    sortOrder: maxOrder + 1,
    enabled:   1,
  }
  await db.insert(flowConfigs).values(item)
  res.json({ data: parse(item) })
})

// PATCH /api/flow-configs/:id
router.patch('/:id', async (req, res) => {
  const payload = { ...req.body }
  if (payload.nodes !== undefined) payload.nodes = JSON.stringify(payload.nodes)
  await db.update(flowConfigs).set(payload).where(eq(flowConfigs.id, req.params.id))
  const [row] = await db.select().from(flowConfigs).where(eq(flowConfigs.id, req.params.id))
  res.json({ data: parse(row) })
})

// DELETE /api/flow-configs/:id
router.delete('/:id', async (req, res) => {
  await db.delete(flowConfigs).where(eq(flowConfigs.id, req.params.id))
  res.json({ success: true })
})

export default router

import { Router } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import { roles } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

function parse(row) {
  if (!row) return null
  return { ...row, permissions: JSON.parse(row.permissions || '[]') }
}

// GET /api/roles
router.get('/', async (req, res) => {
  const rows = await db.select().from(roles).orderBy(roles.sortOrder)
  res.json({ data: rows.map(parse) })
})

// POST /api/roles
router.post('/', async (req, res) => {
  const all = await db.select().from(roles)
  const maxOrder = all.reduce((m, r) => Math.max(m, r.sortOrder), 0)
  const item = {
    id:          randomUUID(),
    key:         req.body.key,
    label:       req.body.label,
    tagType:     req.body.tagType || '',
    permissions: JSON.stringify(req.body.permissions || []),
    sortOrder:   maxOrder + 1,
  }
  await db.insert(roles).values(item)
  res.json({ data: parse(item) })
})

// PATCH /api/roles/:key  — update permissions (and optionally label/tagType)
router.patch('/:key', async (req, res) => {
  const payload = { ...req.body }
  if (payload.permissions !== undefined) payload.permissions = JSON.stringify(payload.permissions)
  await db.update(roles).set(payload).where(eq(roles.key, req.params.key))
  const [row] = await db.select().from(roles).where(eq(roles.key, req.params.key))
  res.json({ data: parse(row) })
})

// DELETE /api/roles/:key
router.delete('/:key', async (req, res) => {
  await db.delete(roles).where(eq(roles.key, req.params.key))
  res.json({ success: true })
})

export default router

import { Router } from 'express'
import { db } from '../db/index.js'
import { inventoryItems } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import { logChange, diffFields } from '../utils/changeLog.js'

const router = Router()

router.get('/:projectId', async (req, res) => {
  const rows = await db.select().from(inventoryItems)
    .where(eq(inventoryItems.projectId, req.params.projectId))
  res.json({ data: rows })
})

router.patch('/:id', async (req, res) => {
  const [existing] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, req.params.id))
  await db.update(inventoryItems).set(req.body).where(eq(inventoryItems.id, req.params.id))
  const [updated] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, req.params.id))
  await logChange(req, {
    entityType: 'inventory_item', entityId: req.params.id, projectId: updated?.projectId || null,
    action: 'update',
    fieldChanges: diffFields(existing, updated, 'inventory_item'),
  })
  res.json({ data: updated })
})

export default router

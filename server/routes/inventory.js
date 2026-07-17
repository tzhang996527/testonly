import { Router } from 'express'
import { db } from '../db/index.js'
import { inventoryItems } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

router.get('/:projectId', async (req, res) => {
  const rows = await db.select().from(inventoryItems)
    .where(eq(inventoryItems.projectId, req.params.projectId))
  res.json({ data: rows })
})

router.patch('/:id', async (req, res) => {
  await db.update(inventoryItems).set(req.body).where(eq(inventoryItems.id, req.params.id))
  const [updated] = await db.select().from(inventoryItems).where(eq(inventoryItems.id, req.params.id))
  res.json({ data: updated })
})

export default router

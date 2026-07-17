import { Router } from 'express'
import { db } from '../db/index.js'
import { assets } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

router.get('/', async (req, res) => {
  const { projectId, keyword } = req.query
  let rows = await db.select().from(assets)
  if (projectId) rows = rows.filter(a => a.projectId === projectId)
  if (keyword)   rows = rows.filter(a => a.assetNo?.includes(keyword) || a.assetName?.includes(keyword))
  res.json({ data: rows, total: rows.length })
})

router.post('/', async (req, res) => {
  const allRows = await db.select().from(assets)
  const item = { ...req.body, id: String(allRows.length + 1) }
  await db.insert(assets).values(item)
  res.json({ data: item })
})

router.patch('/:id', async (req, res) => {
  await db.update(assets).set(req.body).where(eq(assets.id, req.params.id))
  const [updated] = await db.select().from(assets).where(eq(assets.id, req.params.id))
  res.json({ data: updated })
})

export default router

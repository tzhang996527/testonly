import { Router } from 'express'
import { randomUUID } from 'crypto'
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
  const item = { ...req.body, id: randomUUID() }
  await db.insert(assets).values(item)
  res.json({ data: item })
})

router.patch('/:id', async (req, res) => {
  await db.update(assets).set(req.body).where(eq(assets.id, req.params.id))
  const [updated] = await db.select().from(assets).where(eq(assets.id, req.params.id))
  res.json({ data: updated })
})

export default router

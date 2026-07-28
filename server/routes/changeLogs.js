import { Router } from 'express'
import { db } from '../db/index.js'
import { changeLogs, projects } from '../db/schema.js'
import { eq, inArray } from 'drizzle-orm'

const router = Router()

async function attachProjectNo(rows) {
  const ids = [...new Set(rows.map(r => r.projectId).filter(Boolean))]
  if (!ids.length) return rows
  const projRows = await db.select({ id: projects.id, projectNo: projects.projectNo, currentStep: projects.currentStep })
    .from(projects).where(inArray(projects.id, ids))
  const projMap = Object.fromEntries(projRows.map(p => [p.id, p]))
  return rows.map(r => ({
    ...r,
    projectNo:   projMap[r.projectId]?.projectNo   || null,
    currentStep: projMap[r.projectId]?.currentStep || null,
  }))
}

// GET /api/change-logs
router.get('/', async (req, res) => {
  const { projectId, entityType, action, startDate, endDate, keyword, page = 1, pageSize = 20 } = req.query

  let rows = await db.select().from(changeLogs)

  if (projectId)  rows = rows.filter(r => r.projectId === projectId)
  if (entityType) rows = rows.filter(r => r.entityType === entityType)
  if (action)     rows = rows.filter(r => r.action === action)
  if (startDate)  rows = rows.filter(r => r.operatedAt >= startDate)
  if (endDate)    rows = rows.filter(r => r.operatedAt <= endDate + ' 23:59:59')

  if (keyword) {
    // also match against project_no by building a lookup
    const projRows = await db.select({ id: projects.id, projectNo: projects.projectNo }).from(projects)
    const matchedIds = new Set(projRows.filter(p => p.projectNo?.includes(keyword)).map(p => p.id))
    rows = rows.filter(r =>
      r.operatorName?.includes(keyword) ||
      r.operatorUsername?.includes(keyword) ||
      matchedIds.has(r.projectId)
    )
  }

  rows.sort((a, b) => (b.operatedAt > a.operatedAt ? 1 : -1))

  const total = rows.length
  const start = (Number(page) - 1) * Number(pageSize)
  const paged = rows.slice(start, start + Number(pageSize))

  const enriched = await attachProjectNo(paged)
  res.json({
    data: enriched.map(r => ({ ...r, fieldChanges: JSON.parse(r.fieldChanges || '[]') })),
    total,
  })
})

// GET /api/change-logs/:id
router.get('/:id', async (req, res) => {
  const [row] = await db.select().from(changeLogs).where(eq(changeLogs.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  const [enriched] = await attachProjectNo([row])
  res.json({ data: { ...enriched, fieldChanges: JSON.parse(enriched.fieldChanges || '[]') } })
})

// DELETE /api/change-logs/:id
router.delete('/:id', async (req, res) => {
  const [row] = await db.select().from(changeLogs).where(eq(changeLogs.id, req.params.id))
  if (!row) return res.status(404).json({ message: 'Not found' })
  await db.delete(changeLogs).where(eq(changeLogs.id, req.params.id))
  res.json({ success: true })
})

export default router

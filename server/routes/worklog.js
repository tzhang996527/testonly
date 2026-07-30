import { Router } from 'express'
import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import { workWeeklyLogs, workPlanEntries } from '../db/schema.js'
import { eq, and, gte, lte } from 'drizzle-orm'

const router = Router()

// Helper: get Monday of the week containing a given date string
function getWeekStart(dateStr) {
  const d = new Date(dateStr)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

function now() {
  return new Date().toLocaleString('zh-CN')
}

// GET /api/worklog/weeks?userId=&year=&month=
// List weekly log records for a user (or all if admin)
router.get('/weeks', async (req, res) => {
  const { userId, year, month } = req.query
  let rows = await db.select().from(workWeeklyLogs)

  if (userId) rows = rows.filter(r => r.userId === userId)
  if (year)   rows = rows.filter(r => r.weekStart.startsWith(year))
  if (month)  rows = rows.filter(r => {
    const [y, m] = r.weekStart.split('-')
    return m === String(month).padStart(2, '0') && (!year || y === String(year))
  })

  rows.sort((a, b) => b.weekStart.localeCompare(a.weekStart))
  res.json({ data: rows })
})

// GET /api/worklog/weeks/:id  — single week detail with entries
router.get('/weeks/:id', async (req, res) => {
  const [log] = await db.select().from(workWeeklyLogs).where(eq(workWeeklyLogs.id, req.params.id))
  if (!log) return res.status(404).json({ message: 'Not found' })

  const entries = await db.select().from(workPlanEntries)
    .where(eq(workPlanEntries.weeklyLogId, req.params.id))
  entries.sort((a, b) => a.entryDate.localeCompare(b.entryDate))
  res.json({ data: { ...log, entries } })
})

// GET /api/worklog/current?userId=  — find log for the current week (no auto-create)
router.get('/current', async (req, res) => {
  const userId = req.query.userId || req.user?.id || ''
  const userName = req.query.userName || req.user?.name || ''
  const weekStart = getWeekStart(new Date().toISOString().slice(0, 10))

  const [log] = await db.select().from(workWeeklyLogs).where(
    and(eq(workWeeklyLogs.userId, userId), eq(workWeeklyLogs.weekStart, weekStart))
  )

  if (!log) {
    // Return a virtual record without persisting it
    return res.json({ data: { id: null, userId, userName, weekStart, planNote: '', summaryNote: '', entries: [] } })
  }

  const entries = await db.select().from(workPlanEntries)
    .where(eq(workPlanEntries.weeklyLogId, log.id))
  entries.sort((a, b) => a.entryDate.localeCompare(b.entryDate))
  res.json({ data: { ...log, entries } })
})

// GET /api/worklog/week-by-date?weekStart=YYYY-MM-DD&userId=  — no auto-create
router.get('/week-by-date', async (req, res) => {
  const { weekStart, userId, userName } = req.query
  const uid = userId || req.user?.id || ''
  const uname = userName || req.user?.name || ''

  const [log] = await db.select().from(workWeeklyLogs).where(
    and(eq(workWeeklyLogs.userId, uid), eq(workWeeklyLogs.weekStart, weekStart))
  )

  if (!log) {
    return res.json({ data: { id: null, userId: uid, userName: uname, weekStart, planNote: '', summaryNote: '', entries: [] } })
  }

  const entries = await db.select().from(workPlanEntries)
    .where(eq(workPlanEntries.weeklyLogId, log.id))
  entries.sort((a, b) => a.entryDate.localeCompare(b.entryDate))
  res.json({ data: { ...log, entries } })
})

// PUT /api/worklog/weeks/:id  — save plan/summary notes; creates record if id is 'new'
router.put('/weeks/:id', async (req, res) => {
  const { planNote, summaryNote, userId, userName, weekStart } = req.body

  let id = req.params.id
  if (id === 'new') {
    // Lazy-create the week record on first save
    const uid   = userId   || req.user?.id   || ''
    const uname = userName || req.user?.name || ''
    const [existing] = await db.select().from(workWeeklyLogs).where(
      and(eq(workWeeklyLogs.userId, uid), eq(workWeeklyLogs.weekStart, weekStart))
    )
    if (existing) {
      id = existing.id
    } else {
      id = randomUUID()
      await db.insert(workWeeklyLogs).values({
        id, userId: uid, userName: uname, weekStart,
        planNote: '', summaryNote: '', createdAt: now(), updatedAt: now(),
      })
    }
  }

  const [existing] = await db.select().from(workWeeklyLogs).where(eq(workWeeklyLogs.id, id))
  if (!existing) return res.status(404).json({ message: 'Not found' })

  const updates = { updatedAt: now() }
  if (planNote    !== undefined) updates.planNote    = planNote
  if (summaryNote !== undefined) updates.summaryNote = summaryNote

  await db.update(workWeeklyLogs).set(updates).where(eq(workWeeklyLogs.id, id))
  const [updated] = await db.select().from(workWeeklyLogs).where(eq(workWeeklyLogs.id, id))
  res.json({ data: updated })
})

// POST /api/worklog/entries  — add one entry; lazy-creates the week record if needed
router.post('/entries', async (req, res) => {
  const body = req.body
  const uid   = body.userId    || req.user?.id   || ''
  const uname = body.userName  || req.user?.name || ''

  // Resolve weeklyLogId — create the week record on demand if it doesn't exist yet
  let weeklyLogId = body.weeklyLogId
  if (!weeklyLogId) {
    const [existing] = await db.select().from(workWeeklyLogs).where(
      and(eq(workWeeklyLogs.userId, uid), eq(workWeeklyLogs.weekStart, body.weekStart))
    )
    if (existing) {
      weeklyLogId = existing.id
    } else {
      weeklyLogId = randomUUID()
      await db.insert(workWeeklyLogs).values({
        id: weeklyLogId, userId: uid, userName: uname, weekStart: body.weekStart,
        planNote: '', summaryNote: '', createdAt: now(), updatedAt: now(),
      })
    }
  }
  const entry = {
    id:              randomUUID(),
    weeklyLogId,
    userId:          uid,
    weekStart:       body.weekStart,
    entryDate:       body.entryDate,
    projectId:       body.projectId  || null,
    projectNo:       body.projectNo  || '',
    projectName:     body.projectName || '',
    workType:        body.workType   || 'office',
    plannedHours:    Number(body.plannedHours)    || 0,
    actualHours:     Number(body.actualHours)     || 0,
    plannedProgress: Number(body.plannedProgress) || 0,
    actualProgress:  Number(body.actualProgress)  || 0,
    note:            body.note        || '',
    delayReason:     body.delayReason || '',
    entryType:       body.entryType   || 'plan',
    createdAt:       now(),
    updatedAt:       now(),
  }
  await db.insert(workPlanEntries).values(entry)

  await db.update(workWeeklyLogs).set({ updatedAt: now() })
    .where(eq(workWeeklyLogs.id, weeklyLogId))

  res.json({ data: { ...entry, weeklyLogId } })
})

// PATCH /api/worklog/entries/:id  — update an entry
router.patch('/entries/:id', async (req, res) => {
  const [existing] = await db.select().from(workPlanEntries).where(eq(workPlanEntries.id, req.params.id))
  if (!existing) return res.status(404).json({ message: 'Not found' })

  const updates = { ...req.body, updatedAt: now() }
  delete updates.id
  delete updates.weeklyLogId
  delete updates.userId
  delete updates.weekStart

  await db.update(workPlanEntries).set(updates).where(eq(workPlanEntries.id, req.params.id))

  await db.update(workWeeklyLogs).set({ updatedAt: now() })
    .where(eq(workWeeklyLogs.id, existing.weeklyLogId))

  const [updated] = await db.select().from(workPlanEntries).where(eq(workPlanEntries.id, req.params.id))
  res.json({ data: updated })
})

// DELETE /api/worklog/entries/:id
router.delete('/entries/:id', async (req, res) => {
  const [existing] = await db.select().from(workPlanEntries).where(eq(workPlanEntries.id, req.params.id))
  if (!existing) return res.status(404).json({ message: 'Not found' })
  await db.delete(workPlanEntries).where(eq(workPlanEntries.id, req.params.id))
  res.json({ success: true })
})

// GET /api/worklog/project-hours/:projectId
// Returns total planned/actual hours logged against a project across all week plans
router.get('/project-hours/:projectId', async (req, res) => {
  const entries = await db.select().from(workPlanEntries)
    .where(eq(workPlanEntries.projectId, req.params.projectId))
  const totalPlanned = entries.reduce((s, e) => s + (e.plannedHours || 0), 0)
  const totalActual  = entries.reduce((s, e) => s + (e.actualHours  || 0), 0)
  res.json({ data: { totalPlanned, totalActual, entries } })
})

// GET /api/worklog/overview?weekStart=&userId=
// Cross-user overview for managers: list all users' plans for a given week
router.get('/overview', async (req, res) => {
  const { weekStart } = req.query
  let logs = await db.select().from(workWeeklyLogs)
  if (weekStart) logs = logs.filter(l => l.weekStart === weekStart)

  const result = await Promise.all(logs.map(async log => {
    const entries = await db.select().from(workPlanEntries)
      .where(eq(workPlanEntries.weeklyLogId, log.id))
    return { ...log, entries }
  }))
  result.sort((a, b) => (a.userName || '').localeCompare(b.userName || ''))
  res.json({ data: result })
})

export default router

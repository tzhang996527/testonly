import { Router } from 'express'
import { db } from '../db/index.js'
import { projects } from '../db/schema.js'

const router = Router()

router.get('/', async (req, res) => {
  const rows = await db.select().from(projects)
  const stats = {
    totalProjects:       rows.length,
    inProgressProjects:  rows.filter(p => p.status === 'inProgress').length,
    pendingApproval:     rows.filter(p => ['draft','reviewing'].includes(p.status)).length,
    completedThisMonth:  rows.filter(p => p.status === 'archived').length,
  }
  const projectsByStatus = [
    { status: 'draft',      count: rows.filter(p => p.status === 'draft').length,      label: '草稿' },
    { status: 'inProgress', count: rows.filter(p => p.status === 'inProgress').length, label: '执行中' },
    { status: 'reviewing',  count: rows.filter(p => p.status === 'reviewing').length,  label: '审核中' },
    { status: 'confirmed',  count: rows.filter(p => p.status === 'confirmed').length,  label: '已确认' },
    { status: 'archived',   count: rows.filter(p => p.status === 'archived').length,   label: '已归档' },
  ]
  res.json({
    data: {
      stats,
      projectsByStatus,
      recentActivities: [],
      myTasks: [],
    }
  })
})

export default router

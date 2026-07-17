import { Router } from 'express'
import { db } from '../db/index.js'
import { projects, approvalNodes } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

const STAGE_LABELS = {
  overview:     '项目概览',
  'pre-work':   '前期工作',
  inventory:    '清查盘点',
  collection:   '资料收集',
  estimation:   '评定估算',
  review:       '内部审核',
  confirmation: '结果确认',
  archive:      '报告归档',
  tracking:     '后续跟踪',
}

router.get('/', async (req, res) => {
  // current user from header (set by frontend auth store)
  const currentUsername = req.headers['x-username'] || ''

  const rows = await db.select().from(projects)
  const stats = {
    totalProjects:      rows.length,
    inProgressProjects: rows.filter(p => p.status === 'inProgress').length,
    pendingApproval:    rows.filter(p => ['draft','reviewing'].includes(p.status)).length,
    completedThisMonth: rows.filter(p => p.status === 'archived').length,
  }
  const projectsByStatus = [
    { status: 'draft',      count: rows.filter(p => p.status === 'draft').length,      label: '草稿' },
    { status: 'inProgress', count: rows.filter(p => p.status === 'inProgress').length, label: '执行中' },
    { status: 'reviewing',  count: rows.filter(p => p.status === 'reviewing').length,  label: '审核中' },
    { status: 'confirmed',  count: rows.filter(p => p.status === 'confirmed').length,  label: '已确认' },
    { status: 'archived',   count: rows.filter(p => p.status === 'archived').length,   label: '已归档' },
  ]

  // myTasks: find all approval_nodes where current user has a pending action
  let myTasks = []
  if (currentUsername) {
    const allNodes = await db.select().from(approvalNodes)
    const projectMap = Object.fromEntries(rows.map(p => [p.id, p]))

    for (const node of allNodes) {
      if (node.nodeStatus !== 'pending') continue
      const approvers = JSON.parse(node.approvers || '[]')
      const isPending = approvers.some(a => a.username === currentUsername && a.status === 'pending')
      if (!isPending) continue

      const project = projectMap[node.projectId]
      if (!project) continue
      myTasks.push({
        id:        `${node.projectId}-${node.stage}-${node.nodeIndex}`,
        projectId: node.projectId,
        projectNo: project.projectNo,
        title:     `【${STAGE_LABELS[node.stage] || node.stage}】${project.purpose} — ${node.role}审批`,
        type:      'approval',
        stage:     node.stage,
        priority:  'high',
        dueDate:   project.baseDate || '',
      })
    }
  }

  res.json({
    data: { stats, projectsByStatus, recentActivities: [], myTasks },
  })
})

export default router

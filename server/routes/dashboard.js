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
  const currentUsername = req.user?.username || ''

  const [rows, allNodes] = await Promise.all([
    db.select().from(projects),
    db.select().from(approvalNodes),
  ])
  const now = new Date()
  const thisMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const pendingApproval = new Set(
    allNodes.filter(n => n.nodeStatus === 'pending').map(n => n.projectId)
  ).size
  const stats = {
    totalProjects:      rows.length,
    inProgressProjects: rows.filter(p => p.status === 'inProgress').length,
    pendingApproval,
    completedThisMonth: rows.filter(p => p.status === 'archived' && p.updatedAt?.startsWith(thisMonthPrefix)).length,
  }
  const projectsByStatus = [
    { status: 'draft',      count: rows.filter(p => p.status === 'draft').length,      label: '草稿' },
    { status: 'inProgress', count: rows.filter(p => p.status === 'inProgress').length, label: '执行中' },
    { status: 'reviewing',  count: rows.filter(p => p.status === 'reviewing').length,  label: '审核中' },
    { status: 'confirmed',  count: rows.filter(p => p.status === 'confirmed').length,  label: '已确认' },
    { status: 'archived',   count: rows.filter(p => p.status === 'archived').length,   label: '已归档' },
  ]

  // myTasks: find nodes where it's this user's turn (all prior nodes in stage must be approved)
  let myTasks = []
  if (currentUsername) {
    const projectMap = Object.fromEntries(rows.map(p => [p.id, p]))

    // group by projectId+stage, sorted by nodeIndex
    const groups = {}
    for (const node of allNodes) {
      const key = `${node.projectId}::${node.stage}`
      if (!groups[key]) groups[key] = []
      groups[key].push(node)
    }
    for (const nodes of Object.values(groups)) {
      nodes.sort((a, b) => a.nodeIndex - b.nodeIndex)
      // find the first node that isn't approved yet
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        // all previous nodes must be approved
        const prevAllApproved = nodes.slice(0, i).every(n => n.nodeStatus === 'approved')
        if (!prevAllApproved) break
        if (node.nodeStatus === 'approved' || node.nodeStatus === 'rejected') continue

        const approvers = JSON.parse(node.approvers || '[]')
        const isPending = approvers.some(a => a.username === currentUsername && a.status === 'pending')
        if (!isPending) break // not this user's node — stop looking further

        const project = projectMap[node.projectId]
        if (!project) break
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
        break // only surface the first actionable node per stage per project
      }
    }
  }

  res.json({
    data: { stats, projectsByStatus, recentActivities: [], myTasks },
  })
})

export default router

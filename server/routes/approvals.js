import { Router } from 'express'
import { db } from '../db/index.js'
import { approvalNodes, projects } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const router = Router()

function parseNode(row) {
  return { ...row, approvers: JSON.parse(row.approvers || '[]') }
}

// GET /api/approvals/:projectId/:stage
router.get('/:projectId/:stage', async (req, res) => {
  const rows = await db.select().from(approvalNodes)
    .where(and(
      eq(approvalNodes.projectId, req.params.projectId),
      eq(approvalNodes.stage, req.params.stage),
    ))
  rows.sort((a, b) => a.nodeIndex - b.nodeIndex)
  res.json({ data: rows.map(parseNode) })
})

// PUT /api/approvals/:projectId/:stage  — replace entire flow for a stage
// body: [{ role, approvers: [{name, username}] }]
router.put('/:projectId/:stage', async (req, res) => {
  const { projectId, stage } = req.params
  const flowDef = req.body // array of {role, approvers}

  // delete existing nodes for this stage
  await db.delete(approvalNodes).where(
    and(eq(approvalNodes.projectId, projectId), eq(approvalNodes.stage, stage))
  )

  // insert new nodes
  const allNodes = await db.select().from(approvalNodes)
  let nextId = allNodes.length + 1

  const inserted = []
  for (let i = 0; i < flowDef.length; i++) {
    const node = flowDef[i]
    const row = {
      id:         String(nextId++),
      projectId,
      stage,
      nodeIndex:  i,
      role:       node.role,
      nodeStatus: 'pending',
      approvers:  JSON.stringify(
        node.approvers.map(p => ({ ...p, status: 'pending', comment: '', time: '' }))
      ),
    }
    await db.insert(approvalNodes).values(row)
    inserted.push(parseNode(row))
  }
  res.json({ data: inserted })
})

// POST /api/approvals/:projectId/:stage/approve
// body: { role, username, action, comment }
router.post('/:projectId/:stage/approve', async (req, res) => {
  const { projectId, stage } = req.params
  const { role, username, action, comment } = req.body

  const rows = await db.select().from(approvalNodes)
    .where(and(eq(approvalNodes.projectId, projectId), eq(approvalNodes.stage, stage)))
  rows.sort((a, b) => a.nodeIndex - b.nodeIndex)

  const node = rows.find(r => r.role === role)
  if (!node) return res.status(404).json({ message: 'Node not found' })

  const approvers = JSON.parse(node.approvers)
  const person = approvers.find(a => a.username === username)
  if (person) {
    person.status  = action
    person.comment = comment
    person.time    = new Date().toLocaleString('zh-CN')
  }
  const nodeStatus = approvers.some(a => a.status === 'approved') ? 'approved'
    : approvers.every(a => a.status === 'rejected') ? 'rejected' : 'pending'

  await db.update(approvalNodes)
    .set({ approvers: JSON.stringify(approvers), nodeStatus })
    .where(eq(approvalNodes.id, node.id))

  // if all nodes in this stage approved and it's the overview stage, update project status
  const updatedRows = await db.select().from(approvalNodes)
    .where(and(eq(approvalNodes.projectId, projectId), eq(approvalNodes.stage, stage)))
  const allApproved = updatedRows.every(r => r.nodeStatus === 'approved')

  if (allApproved && stage === 'overview') {
    await db.update(projects).set({ status: 'approved' }).where(eq(projects.id, projectId))
  }

  const finalRows = await db.select().from(approvalNodes)
    .where(and(eq(approvalNodes.projectId, projectId), eq(approvalNodes.stage, stage)))
  finalRows.sort((a, b) => a.nodeIndex - b.nodeIndex)
  res.json({ data: finalRows.map(parseNode) })
})

export default router

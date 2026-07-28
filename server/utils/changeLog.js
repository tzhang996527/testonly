import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import { changeLogs } from '../db/schema.js'

// Field label maps per entity type
export const FIELD_LABELS = {
  project: {
    purpose:       '评估目的',
    baseDate:      '基准日期',
    assetCategory: '资产类别',
    responsible:   '负责人',
    department:    '委托方',
    status:        '状态',
    remark:        '备注',
  },
  asset: {
    assetNo:       '资产编号',
    assetName:     '资产名称',
    spec:          '规格型号',
    location:      '存放地点',
    ownershipNo:   '权属证号',
    originalValue: '原值',
    netValue:      '净值',
    assessedValue: '评估值',
    method:        '评估方法',
    assessor:      '评估师',
    reportNo:      '报告编号',
  },
  inventory_item: {
    bookValue:  '账面值',
    fieldValue: '现场值',
    diff:       '差异',
    diffReason: '差异原因',
    status:     '状态',
    handler:    '处理人',
    handleTime: '处理时间',
  },
  stage_pre_work: {
    contractNo: '合同编号',
    clientName: '委托方名称',
    signDate:   '签订日期',
    amount:     '合同金额',
    planStart:  '计划开始',
    planEnd:    '计划结束',
    members:    '评估人员',
    erpStatus:  '工作进度状态',
  },
  stage_inventory: {
    surveyDate:      '现场勘查日期',
    surveyPersonnel: '勘查人员',
    surveyDesc:      '勘查描述',
    erpStatus:       '工作进度状态',
  },
  stage_collection:  { erpStatus: '工作进度状态' },
  stage_estimation:  { erpStatus: '工作进度状态' },
  stage_review:      { erpStatus: '工作进度状态' },
  stage_confirmation: {
    reportNo:       '报告编号',
    originalValue:  '原值合计',
    netValue:       '净值合计',
    assessedValue:  '评估值合计',
    method:         '评估方法',
    assessmentOrg:  '评估机构',
    assessor:       '评估师',
    clientFeedback: '委托方意见',
  },
  stage_archive: {
    archiveNo:       '档案编号',
    archivist:       '归档人',
    archiveDate:     '归档日期',
    retentionYears:  '保管年限',
    storageLocation: '存储位置',
  },
  approval: {
    stage:      '审批阶段',
    role:       '审批角色',
    approver:   '审批人',
    decision:   '审批结果',
    comment:    '审批意见',
    nodeStatus: '节点状态',
  },
}

export function diffFields(before, after, entityType) {
  const labels = FIELD_LABELS[entityType] || {}
  const changes = []
  for (const [field, label] of Object.entries(labels)) {
    const oldVal = before?.[field] ?? null
    const newVal = after?.[field] ?? null
    if (String(oldVal ?? '') !== String(newVal ?? '')) {
      changes.push({ field, fieldLabel: label, oldValue: oldVal, newValue: newVal })
    }
  }
  return changes
}

export async function logChange(req, { entityType, entityId, projectId, action, fieldChanges }) {
  if (action === 'update' && fieldChanges.length === 0) return
  await db.insert(changeLogs).values({
    id:               randomUUID(),
    entityType,
    entityId,
    projectId:        projectId || null,
    action,
    fieldChanges:     JSON.stringify(fieldChanges),
    operatorId:       req.user?.id || null,
    operatorName:     req.user?.name || null,
    operatorUsername: req.user?.username || null,
    operatorIp:       req.headers['x-forwarded-for'] || req.ip || null,
    operatedAt:       new Date().toLocaleString('zh-CN'),
  })
}

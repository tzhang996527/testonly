import dayjs from 'dayjs'

export const mockProjects = [
  {
    id: '1',
    projectNo: 'PJ-2024-0001',
    purpose: '股权转让评估',
    baseDate: '2024-03-31',
    assetCategory: 'whole',
    responsible: '张伟',
    department: '资产评估部',
    status: 'inProgress',
    currentStep: 4,
    createdAt: '2024-01-10 09:00:00',
    createdBy: '张伟',
    remark: '某科技公司股权转让，需对整体资产进行评估',
    preWorkApprovals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-01-15 10:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'approved', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-01-16 09:30:00' },
      ]},
      { role: '总经理', nodeStatus: 'approved', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-01-17 15:00:00' },
      ]},
    ],
    approvals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意立项', time: '2024-01-11 10:00:00' },
        { name: '赵敏', username: 'zhao.min', status: 'pending', comment: '', time: '' },
      ]},
      { role: '风控', nodeStatus: 'approved', approvers: [
        { name: '王风控', username: 'wang.riskctrl', status: 'approved', comment: '风险可控', time: '2024-01-12 14:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'approved', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-01-13 09:30:00' },
      ]},
      { role: '总经理', nodeStatus: 'approved', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-01-14 16:00:00' },
      ]},
    ],
  },
  {
    id: '2',
    projectNo: 'PJ-2024-0002',
    purpose: '抵押贷款评估',
    baseDate: '2024-04-30',
    assetCategory: 'fixed',
    responsible: '李娜',
    department: '资产评估部',
    status: 'reviewing',
    currentStep: 6,
    createdAt: '2024-02-05 10:00:00',
    createdBy: '李娜',
    remark: '某制造企业固定资产抵押评估',
    preWorkApprovals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-02-08 10:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'pending', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'pending', comment: '', time: '' },
      ]},
      { role: '总经理', nodeStatus: 'pending', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' },
      ]},
    ],
    approvals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-02-06 10:00:00' },
      ]},
      { role: '风控', nodeStatus: 'approved', approvers: [
        { name: '王风控', username: 'wang.riskctrl', status: 'approved', comment: '已审核', time: '2024-02-07 11:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'pending', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'pending', comment: '', time: '' },
      ]},
      { role: '总经理', nodeStatus: 'pending', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' },
      ]},
    ],
  },
  {
    id: '3',
    projectNo: 'PJ-2024-0003',
    purpose: '资产处置评估',
    baseDate: '2024-05-31',
    assetCategory: 'intangible',
    responsible: '王磊',
    department: '资产评估部',
    status: 'draft',
    currentStep: 1,
    createdAt: '2024-03-20 14:00:00',
    createdBy: '王磊',
    remark: '知识产权处置评估',
    preWorkApprovals: [
      { role: '部门负责人', nodeStatus: 'pending', approvers: [
        { name: '李经理', username: 'li.manager', status: 'pending', comment: '', time: '' },
      ]},
      { role: '办公室', nodeStatus: 'pending', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'pending', comment: '', time: '' },
      ]},
      { role: '总经理', nodeStatus: 'pending', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' },
      ]},
    ],
    approvals: [
      { role: '部门负责人', nodeStatus: 'pending', approvers: [
        { name: '李经理', username: 'li.manager', status: 'pending', comment: '', time: '' },
        { name: '赵敏', username: 'zhao.min', status: 'pending', comment: '', time: '' },
      ]},
      { role: '风控', nodeStatus: 'pending', approvers: [
        { name: '王风控', username: 'wang.riskctrl', status: 'pending', comment: '', time: '' },
      ]},
      { role: '办公室', nodeStatus: 'pending', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'pending', comment: '', time: '' },
      ]},
      { role: '总经理', nodeStatus: 'pending', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' },
      ]},
    ],
  },
  {
    id: '4',
    projectNo: 'PJ-2024-0004',
    purpose: '企业清算评估',
    baseDate: '2024-06-30',
    assetCategory: 'inventory',
    responsible: '赵敏',
    department: '资产评估部',
    status: 'confirmed',
    currentStep: 8,
    createdAt: '2024-04-01 08:00:00',
    createdBy: '赵敏',
    remark: '存货清算评估项目',
    preWorkApprovals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-04-03 10:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'approved', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-04-04 09:30:00' },
      ]},
      { role: '总经理', nodeStatus: 'approved', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-04-05 15:00:00' },
      ]},
    ],
    approvals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-04-02 10:00:00' },
      ]},
      { role: '风控', nodeStatus: 'approved', approvers: [
        { name: '王风控', username: 'wang.riskctrl', status: 'approved', comment: '已审核', time: '2024-04-03 11:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'approved', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-04-04 09:30:00' },
      ]},
      { role: '总经理', nodeStatus: 'approved', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-04-05 15:00:00' },
      ]},
    ],
  },
  {
    id: '5',
    projectNo: 'PJ-2024-0005',
    purpose: '司法鉴定评估',
    baseDate: '2024-07-31',
    assetCategory: 'fixed',
    responsible: '张伟',
    department: '资产评估部',
    status: 'archived',
    currentStep: 9,
    createdAt: '2024-05-10 09:00:00',
    createdBy: '张伟',
    remark: '涉案固定资产司法鉴定',
    preWorkApprovals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-05-12 10:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'approved', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-05-13 09:30:00' },
      ]},
      { role: '总经理', nodeStatus: 'approved', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-05-14 15:00:00' },
      ]},
    ],
    approvals: [
      { role: '部门负责人', nodeStatus: 'approved', approvers: [
        { name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-05-11 10:00:00' },
      ]},
      { role: '风控', nodeStatus: 'approved', approvers: [
        { name: '王风控', username: 'wang.riskctrl', status: 'approved', comment: '已审核', time: '2024-05-12 11:00:00' },
      ]},
      { role: '办公室', nodeStatus: 'approved', approvers: [
        { name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-05-13 09:30:00' },
      ]},
      { role: '总经理', nodeStatus: 'approved', approvers: [
        { name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-05-14 15:00:00' },
      ]},
    ],
  },
]

export const mockAssets = [
  { id: '1', projectId: '1', assetNo: 'FA-2024-001', assetName: '数控机床', spec: 'CNC-500A', location: '生产车间A', ownershipNo: '机设证-001', originalValue: 850000, netValue: 612000, assessedValue: 700000, method: 'market', assessor: '李评估师', reportNo: 'RPT-2024-001' },
  { id: '2', projectId: '1', assetNo: 'FA-2024-002', assetName: '工业机器人', spec: 'ABB-IRB6700', location: '生产车间B', ownershipNo: '机设证-002', originalValue: 1200000, netValue: 900000, assessedValue: 1050000, method: 'market', assessor: '李评估师', reportNo: 'RPT-2024-001' },
  { id: '3', projectId: '1', assetNo: 'FA-2024-003', assetName: '办公楼', spec: '钢混结构 5层', location: '园区北区', ownershipNo: '房产证-A101', originalValue: 5000000, netValue: 4200000, assessedValue: 6800000, method: 'assetBase', assessor: '王评估师', reportNo: 'RPT-2024-001' },
  { id: '4', projectId: '2', assetNo: 'FA-2024-004', assetName: '生产线设备', spec: '自动化生产线', location: '生产车间C', ownershipNo: '机设证-003', originalValue: 3500000, netValue: 2800000, assessedValue: 3200000, method: 'income', assessor: '张评估师', reportNo: 'RPT-2024-002' },
  { id: '5', projectId: '3', assetNo: 'IA-2024-001', assetName: '软件著作权', spec: 'ERP系统V2.0', location: '总部', ownershipNo: '著作权-001', originalValue: 200000, netValue: 160000, assessedValue: 350000, method: 'income', assessor: '赵评估师', reportNo: 'RPT-2024-003' },
  { id: '6', projectId: '4', assetNo: 'IV-2024-001', assetName: '原材料库存', spec: '铝合金原材料', location: '仓库A', ownershipNo: '存货-001', originalValue: 450000, netValue: 450000, assessedValue: 432000, method: 'market', assessor: '孙评估师', reportNo: 'RPT-2024-004' },
]

export const mockUsers = [
  { id: '1', username: 'admin', name: '系统管理员', role: 'admin', department: '信息中心', email: 'admin@company.com', status: 'active' },
  { id: '2', username: 'zhang.wei', name: '张伟', role: 'assessor', department: '资产评估部', email: 'zhang.wei@company.com', status: 'active' },
  { id: '3', username: 'li.na', name: '李娜', role: 'assessor', department: '资产评估部', email: 'li.na@company.com', status: 'active' },
  { id: '4', username: 'wang.lei', name: '王磊', role: 'assessor', department: '资产评估部', email: 'wang.lei@company.com', status: 'active' },
  { id: '5', username: 'zhao.min', name: '赵敏', role: 'deptManager', department: '资产评估部', email: 'zhao.min@company.com', status: 'active' },
  { id: '6', username: 'li.manager', name: '李经理', role: 'deptManager', department: '资产评估部', email: 'li.manager@company.com', status: 'active' },
  { id: '7', username: 'wang.riskctrl', name: '王风控', role: 'riskControl', department: '风控部', email: 'wang.riskctrl@company.com', status: 'active' },
  { id: '8', username: 'office.chief', name: '办公室主任', role: 'office', department: '办公室', email: 'office@company.com', status: 'active' },
  { id: '9', username: 'chen.ceo', name: '陈总', role: 'ceo', department: '总经理室', email: 'ceo@company.com', status: 'active' },
]

export const mockInventoryItems = [
  { id: '1', projectId: '1', assetNo: 'FA-2024-001', assetName: '数控机床', bookValue: 612000, fieldValue: 608000, diff: -4000, diffReason: '磨损略大', status: 'handled', handler: '张伟', handleTime: '2024-02-20' },
  { id: '2', projectId: '1', assetNo: 'FA-2024-002', assetName: '工业机器人', bookValue: 900000, fieldValue: 900000, diff: 0, diffReason: '', status: 'done', handler: '', handleTime: '' },
  { id: '3', projectId: '1', assetNo: 'FA-2024-003', assetName: '办公楼', bookValue: 4200000, fieldValue: 4200000, diff: 0, diffReason: '', status: 'done', handler: '', handleTime: '' },
]

export const mockDocuments = [
  { id: '1', projectId: '1', category: 'ownership', name: '房产证-A101.pdf', size: '2.1MB', uploadedBy: '张伟', uploadedAt: '2024-02-15 10:00:00', status: 'verified' },
  { id: '2', projectId: '1', category: 'financial', name: '近三年审计报告.pdf', size: '5.3MB', uploadedBy: '张伟', uploadedAt: '2024-02-15 10:30:00', status: 'verified' },
  { id: '3', projectId: '1', category: 'technical', name: '机床使用说明书.pdf', size: '1.2MB', uploadedBy: '李娜', uploadedAt: '2024-02-16 09:00:00', status: 'verified' },
  { id: '4', projectId: '1', category: 'external', name: '市场报价单.xlsx', size: '0.8MB', uploadedBy: '李娜', uploadedAt: '2024-02-16 14:00:00', status: 'pending' },
  { id: '5', projectId: '2', category: 'ownership', name: '设备购置发票.pdf', size: '0.5MB', uploadedBy: '李娜', uploadedAt: '2024-03-10 10:00:00', status: 'verified' },
]

export const mockDashboard = {
  stats: {
    totalProjects: 5,
    inProgressProjects: 2,
    pendingApproval: 3,
    completedThisMonth: 1,
  },
  recentActivities: [
    { id: '1', type: 'approve', user: '陈总', action: '批准了评估立项', project: 'PJ-2024-0001', time: '2024-01-14 16:00:00' },
    { id: '2', type: 'upload', user: '李娜', action: '上传了市场报价单', project: 'PJ-2024-0001', time: '2024-02-16 14:00:00' },
    { id: '3', type: 'submit', user: '赵敏', action: '提交审核评估报告', project: 'PJ-2024-0004', time: '2024-04-10 09:00:00' },
    { id: '4', type: 'create', user: '王磊', action: '新建评估立项', project: 'PJ-2024-0003', time: '2024-03-20 14:00:00' },
    { id: '5', type: 'complete', user: '张伟', action: '完成资产归档', project: 'PJ-2024-0005', time: '2024-06-01 11:00:00' },
  ],
  projectsByStatus: [
    { status: 'draft', count: 1, label: '草稿' },
    { status: 'inProgress', count: 2, label: '执行中' },
    { status: 'reviewing', count: 1, label: '审核中' },
    { status: 'confirmed', count: 1, label: '已确认' },
    { status: 'archived', count: 1, label: '已归档' },
  ],
  myTasks: [
    { id: '1', title: 'PJ-2024-0002 资料审核待处理', type: 'review', priority: 'high', dueDate: '2024-04-20' },
    { id: '2', title: 'PJ-2024-0001 评定估算待录入', type: 'estimation', priority: 'medium', dueDate: '2024-04-25' },
    { id: '3', title: 'PJ-2024-0003 立项审批待处理', type: 'approval', priority: 'high', dueDate: '2024-04-18' },
  ],
}

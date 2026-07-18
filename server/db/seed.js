// Run with: node server/db/seed.js
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sql } from 'drizzle-orm'
import * as schema from './schema.js'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '../../erp.db')

const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
const db = drizzle(sqlite, { schema })

// ── Create tables ──────────────────────────────────────────
sqlite.exec(`
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  project_no TEXT NOT NULL,
  purpose TEXT NOT NULL,
  base_date TEXT,
  asset_category TEXT,
  responsible TEXT,
  department TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  current_step INTEGER NOT NULL DEFAULT 1,
  remark TEXT,
  created_at TEXT,
  created_by TEXT
);

CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  asset_no TEXT,
  asset_name TEXT,
  spec TEXT,
  location TEXT,
  ownership_no TEXT,
  original_value REAL DEFAULT 0,
  net_value REAL DEFAULT 0,
  assessed_value REAL DEFAULT 0,
  method TEXT,
  assessor TEXT,
  report_no TEXT
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  asset_no TEXT,
  asset_name TEXT,
  book_value REAL DEFAULT 0,
  field_value REAL DEFAULT 0,
  diff REAL DEFAULT 0,
  diff_reason TEXT,
  status TEXT DEFAULT 'pending',
  handler TEXT,
  handle_time TEXT
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT '',
  category TEXT,
  name TEXT,
  size TEXT,
  stored_name TEXT,
  uploaded_by TEXT,
  uploaded_at TEXT,
  status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  name TEXT,
  role TEXT,
  department TEXT,
  email TEXT,
  status TEXT DEFAULT 'active',
  password TEXT DEFAULT '123456'
);

CREATE TABLE IF NOT EXISTS approval_nodes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  node_index INTEGER NOT NULL,
  role TEXT NOT NULL,
  node_status TEXT NOT NULL DEFAULT 'pending',
  approvers TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS stage_pre_work (
  project_id TEXT PRIMARY KEY,
  contract_no TEXT,
  client_name TEXT,
  sign_date TEXT,
  amount REAL DEFAULT 0,
  plan_start TEXT,
  plan_end TEXT,
  members TEXT DEFAULT '[]',
  erp_status TEXT DEFAULT '[]',
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS stage_inventory (
  project_id TEXT PRIMARY KEY,
  survey_date TEXT,
  survey_personnel TEXT,
  survey_desc TEXT,
  erp_status TEXT DEFAULT '[]',
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS stage_collection (
  project_id TEXT PRIMARY KEY,
  erp_status TEXT DEFAULT '[]',
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS stage_estimation (
  project_id TEXT PRIMARY KEY,
  erp_status TEXT DEFAULT '[]',
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS stage_review (
  project_id TEXT PRIMARY KEY,
  erp_status TEXT DEFAULT '[]',
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS stage_confirmation (
  project_id TEXT PRIMARY KEY,
  report_no TEXT,
  original_value REAL DEFAULT 0,
  net_value REAL DEFAULT 0,
  assessed_value REAL DEFAULT 0,
  method TEXT,
  assessment_org TEXT,
  assessor TEXT,
  client_feedback TEXT,
  confirmed_at TEXT,
  confirmed_by TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS stage_archive (
  project_id TEXT PRIMARY KEY,
  archive_no TEXT,
  archivist TEXT,
  archive_date TEXT,
  retention_years INTEGER DEFAULT 10,
  storage_location TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS tracking_records (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  type TEXT,
  date TEXT,
  content TEXT,
  recorder TEXT,
  created_at TEXT
);

CREATE TABLE IF NOT EXISTS assessment_purposes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS assessment_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS flow_configs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scene TEXT,
  nodes TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  tag_type TEXT DEFAULT '',
  permissions TEXT NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0
);
`)

// ── Seed data ──────────────────────────────────────────────
const mockProjects = [
  {
    id: '1', projectNo: 'PJ-2024-0001', purpose: '股权转让评估', baseDate: '2024-03-31',
    assetCategory: 'whole', responsible: '张伟', department: '资产评估部',
    status: 'inProgress', currentStep: 3, createdAt: '2024-01-10 09:00:00', createdBy: '张伟',
    remark: '某科技公司股权转让，需对整体资产进行评估',
  },
  {
    id: '2', projectNo: 'PJ-2024-0002', purpose: '抵押贷款评估', baseDate: '2024-04-30',
    assetCategory: 'fixed', responsible: '李娜', department: '资产评估部',
    status: 'reviewing', currentStep: 6, createdAt: '2024-02-05 10:00:00', createdBy: '李娜',
    remark: '某制造企业固定资产抵押评估',
  },
  {
    id: '3', projectNo: 'PJ-2024-0003', purpose: '资产处置评估', baseDate: '2024-05-31',
    assetCategory: 'intangible', responsible: '王磊', department: '资产评估部',
    status: 'draft', currentStep: 1, createdAt: '2024-03-20 14:00:00', createdBy: '王磊',
    remark: '知识产权处置评估',
  },
  {
    id: '4', projectNo: 'PJ-2024-0004', purpose: '企业清算评估', baseDate: '2024-06-30',
    assetCategory: 'inventory', responsible: '赵敏', department: '资产评估部',
    status: 'confirmed', currentStep: 8, createdAt: '2024-04-01 08:00:00', createdBy: '赵敏',
    remark: '存货清算评估项目',
  },
  {
    id: '5', projectNo: 'PJ-2024-0005', purpose: '司法鉴定评估', baseDate: '2024-07-31',
    assetCategory: 'fixed', responsible: '张伟', department: '资产评估部',
    status: 'archived', currentStep: 9, createdAt: '2024-05-10 09:00:00', createdBy: '张伟',
    remark: '涉案固定资产司法鉴定',
  },
]

// approval_nodes seed: stage -> nodeIndex -> {role, nodeStatus, approvers}
const mockApprovalNodes = [
  // project 1 — overview (all approved)
  { id: 'an-1', projectId: '1', stage: 'overview', nodeIndex: 0, role: '部门负责人', nodeStatus: 'approved', approvers: [{ name: '李经理', username: 'li.manager', status: 'approved', comment: '同意立项', time: '2024-01-11 10:00:00' }] },
  { id: 'an-2', projectId: '1', stage: 'overview', nodeIndex: 1, role: '风控',       nodeStatus: 'approved', approvers: [{ name: '王风控', username: 'wang.riskctrl', status: 'approved', comment: '风险可控', time: '2024-01-12 14:00:00' }] },
  { id: 'an-3', projectId: '1', stage: 'overview', nodeIndex: 2, role: '办公室',     nodeStatus: 'approved', approvers: [{ name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-01-13 09:30:00' }] },
  { id: 'an-4', projectId: '1', stage: 'overview', nodeIndex: 3, role: '总经理',     nodeStatus: 'approved', approvers: [{ name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-01-14 16:00:00' }] },
  // project 1 — pre-work (all approved)
  { id: 'an-5', projectId: '1', stage: 'pre-work', nodeIndex: 0, role: '部门负责人', nodeStatus: 'approved', approvers: [{ name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-01-15 10:00:00' }] },
  { id: 'an-6', projectId: '1', stage: 'pre-work', nodeIndex: 1, role: '办公室',     nodeStatus: 'approved', approvers: [{ name: '办公室主任', username: 'office.chief', status: 'approved', comment: '已确认', time: '2024-01-16 09:30:00' }] },
  { id: 'an-7', projectId: '1', stage: 'pre-work', nodeIndex: 2, role: '总经理',     nodeStatus: 'approved', approvers: [{ name: '陈总', username: 'chen.ceo', status: 'approved', comment: '批准', time: '2024-01-17 15:00:00' }] },

  // project 2 — overview (all approved)
  { id: 'an-8',  projectId: '2', stage: 'overview', nodeIndex: 0, role: '部门负责人', nodeStatus: 'approved', approvers: [{ name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-02-06 10:00:00' }] },
  { id: 'an-9',  projectId: '2', stage: 'overview', nodeIndex: 1, role: '风控',       nodeStatus: 'approved', approvers: [{ name: '王风控', username: 'wang.riskctrl', status: 'approved', comment: '已审核', time: '2024-02-07 11:00:00' }] },
  { id: 'an-10', projectId: '2', stage: 'overview', nodeIndex: 2, role: '办公室',     nodeStatus: 'pending', approvers: [{ name: '办公室主任', username: 'office.chief', status: 'pending', comment: '', time: '' }] },
  { id: 'an-11', projectId: '2', stage: 'overview', nodeIndex: 3, role: '总经理',     nodeStatus: 'pending', approvers: [{ name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' }] },
  // project 2 — pre-work (partial)
  { id: 'an-12', projectId: '2', stage: 'pre-work', nodeIndex: 0, role: '部门负责人', nodeStatus: 'approved', approvers: [{ name: '李经理', username: 'li.manager', status: 'approved', comment: '同意', time: '2024-02-08 10:00:00' }] },
  { id: 'an-13', projectId: '2', stage: 'pre-work', nodeIndex: 1, role: '办公室',     nodeStatus: 'pending', approvers: [{ name: '办公室主任', username: 'office.chief', status: 'pending', comment: '', time: '' }] },
  { id: 'an-14', projectId: '2', stage: 'pre-work', nodeIndex: 2, role: '总经理',     nodeStatus: 'pending', approvers: [{ name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' }] },
  // project 2 — review (pending)
  { id: 'an-15', projectId: '2', stage: 'review', nodeIndex: 0, role: '部门负责人', nodeStatus: 'pending', approvers: [{ name: '李经理', username: 'li.manager', status: 'pending', comment: '', time: '' }] },
  { id: 'an-16', projectId: '2', stage: 'review', nodeIndex: 1, role: '总经理',     nodeStatus: 'pending', approvers: [{ name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' }] },

  // project 3 — overview (all pending)
  { id: 'an-17', projectId: '3', stage: 'overview', nodeIndex: 0, role: '部门负责人', nodeStatus: 'pending', approvers: [{ name: '李经理', username: 'li.manager', status: 'pending', comment: '', time: '' }, { name: '赵敏', username: 'zhao.min', status: 'pending', comment: '', time: '' }] },
  { id: 'an-18', projectId: '3', stage: 'overview', nodeIndex: 1, role: '风控',       nodeStatus: 'pending', approvers: [{ name: '王风控', username: 'wang.riskctrl', status: 'pending', comment: '', time: '' }] },
  { id: 'an-19', projectId: '3', stage: 'overview', nodeIndex: 2, role: '办公室',     nodeStatus: 'pending', approvers: [{ name: '办公室主任', username: 'office.chief', status: 'pending', comment: '', time: '' }] },
  { id: 'an-20', projectId: '3', stage: 'overview', nodeIndex: 3, role: '总经理',     nodeStatus: 'pending', approvers: [{ name: '陈总', username: 'chen.ceo', status: 'pending', comment: '', time: '' }] },
]

const mockAssets = [
  { id: '1', projectId: '1', assetNo: 'FA-2024-001', assetName: '数控机床', spec: 'CNC-500A', location: '生产车间A', ownershipNo: '机设证-001', originalValue: 850000, netValue: 612000, assessedValue: 700000, method: 'market', assessor: '李评估师', reportNo: 'RPT-2024-001' },
  { id: '2', projectId: '1', assetNo: 'FA-2024-002', assetName: '工业机器人', spec: 'ABB-IRB6700', location: '生产车间B', ownershipNo: '机设证-002', originalValue: 1200000, netValue: 900000, assessedValue: 1050000, method: 'market', assessor: '李评估师', reportNo: 'RPT-2024-001' },
  { id: '3', projectId: '1', assetNo: 'FA-2024-003', assetName: '办公楼', spec: '钢混结构 5层', location: '园区北区', ownershipNo: '房产证-A101', originalValue: 5000000, netValue: 4200000, assessedValue: 6800000, method: 'assetBase', assessor: '王评估师', reportNo: 'RPT-2024-001' },
  { id: '4', projectId: '2', assetNo: 'FA-2024-004', assetName: '生产线设备', spec: '自动化生产线', location: '生产车间C', ownershipNo: '机设证-003', originalValue: 3500000, netValue: 2800000, assessedValue: 3200000, method: 'income', assessor: '张评估师', reportNo: 'RPT-2024-002' },
  { id: '5', projectId: '3', assetNo: 'IA-2024-001', assetName: '软件著作权', spec: 'ERP系统V2.0', location: '总部', ownershipNo: '著作权-001', originalValue: 200000, netValue: 160000, assessedValue: 350000, method: 'income', assessor: '赵评估师', reportNo: 'RPT-2024-003' },
  { id: '6', projectId: '4', assetNo: 'IV-2024-001', assetName: '原材料库存', spec: '铝合金原材料', location: '仓库A', ownershipNo: '存货-001', originalValue: 450000, netValue: 450000, assessedValue: 432000, method: 'market', assessor: '孙评估师', reportNo: 'RPT-2024-004' },
]

const mockInventoryItems = [
  { id: '1', projectId: '1', assetNo: 'FA-2024-001', assetName: '数控机床', bookValue: 612000, fieldValue: 608000, diff: -4000, diffReason: '磨损略大', status: 'handled', handler: '张伟', handleTime: '2024-02-20' },
  { id: '2', projectId: '1', assetNo: 'FA-2024-002', assetName: '工业机器人', bookValue: 900000, fieldValue: 900000, diff: 0, diffReason: '', status: 'done', handler: '', handleTime: '' },
  { id: '3', projectId: '1', assetNo: 'FA-2024-003', assetName: '办公楼', bookValue: 4200000, fieldValue: 4200000, diff: 0, diffReason: '', status: 'done', handler: '', handleTime: '' },
]

const mockDocuments = [
  { id: '1', projectId: '1', stage: 'collection', category: 'ownership',  name: '房产证-A101.pdf',   size: '2.1MB', uploadedBy: '张伟', uploadedAt: '2024-02-15 10:00:00', status: 'verified' },
  { id: '2', projectId: '1', stage: 'collection', category: 'financial',  name: '近三年审计报告.pdf', size: '5.3MB', uploadedBy: '张伟', uploadedAt: '2024-02-15 10:30:00', status: 'verified' },
  { id: '3', projectId: '1', stage: 'collection', category: 'technical',  name: '机床使用说明书.pdf', size: '1.2MB', uploadedBy: '李娜', uploadedAt: '2024-02-16 09:00:00', status: 'verified' },
  { id: '4', projectId: '1', stage: 'collection', category: 'external',   name: '市场报价单.xlsx',   size: '0.8MB', uploadedBy: '李娜', uploadedAt: '2024-02-16 14:00:00', status: 'pending' },
  { id: '5', projectId: '2', stage: 'collection', category: 'ownership',  name: '设备购置发票.pdf',  size: '0.5MB', uploadedBy: '李娜', uploadedAt: '2024-03-10 10:00:00', status: 'verified' },
]

const mockUsers = [
  { id: '1', username: 'admin',         name: '系统管理员', roles: ['admin'],                      department: '信息中心',   email: 'admin@company.com' },
  { id: '2', username: 'zhang.wei',     name: '张伟',       roles: ['assessor'],                   department: '资产评估部', email: 'zhang.wei@company.com' },
  { id: '3', username: 'li.na',         name: '李娜',       roles: ['assessor'],                   department: '资产评估部', email: 'li.na@company.com' },
  { id: '4', username: 'wang.lei',      name: '王磊',       roles: ['assessor'],                   department: '资产评估部', email: 'wang.lei@company.com' },
  { id: '5', username: 'zhao.min',      name: '赵敏',       roles: ['assessor', 'deptManager'],    department: '资产评估部', email: 'zhao.min@company.com' },
  { id: '6', username: 'li.manager',    name: '李经理',     roles: ['deptManager'],                department: '资产评估部', email: 'li.manager@company.com' },
  { id: '7', username: 'wang.riskctrl', name: '王风控',     roles: ['riskControl'],                department: '风控部',     email: 'wang.riskctrl@company.com' },
  { id: '8', username: 'office.chief',  name: '办公室主任', roles: ['office'],                     department: '办公室',     email: 'office@company.com' },
  { id: '9', username: 'chen.ceo',      name: '陈总',       roles: ['ceo'],                        department: '总经理室',   email: 'ceo@company.com' },
]

// ── Insert (skip if already exists) ───────────────────────
const insertProject = sqlite.prepare(`
  INSERT OR IGNORE INTO projects
    (id, project_no, purpose, base_date, asset_category, responsible, department,
     status, current_step, remark, created_at, created_by)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
`)

for (const p of mockProjects) {
  insertProject.run(
    p.id, p.projectNo, p.purpose, p.baseDate, p.assetCategory, p.responsible, p.department,
    p.status, p.currentStep, p.remark, p.createdAt, p.createdBy,
  )
}

const insertApprovalNode = sqlite.prepare(`
  INSERT OR IGNORE INTO approval_nodes
    (id, project_id, stage, node_index, role, node_status, approvers)
  VALUES (?,?,?,?,?,?,?)
`)
for (const n of mockApprovalNodes) {
  insertApprovalNode.run(n.id, n.projectId, n.stage, n.nodeIndex, n.role, n.nodeStatus, JSON.stringify(n.approvers))
}

const insertAsset = sqlite.prepare(`
  INSERT OR IGNORE INTO assets
    (id, project_id, asset_no, asset_name, spec, location, ownership_no,
     original_value, net_value, assessed_value, method, assessor, report_no)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
`)
for (const a of mockAssets) {
  insertAsset.run(a.id, a.projectId, a.assetNo, a.assetName, a.spec, a.location,
    a.ownershipNo, a.originalValue, a.netValue, a.assessedValue, a.method, a.assessor, a.reportNo)
}

const insertInv = sqlite.prepare(`
  INSERT OR IGNORE INTO inventory_items
    (id, project_id, asset_no, asset_name, book_value, field_value, diff, diff_reason, status, handler, handle_time)
  VALUES (?,?,?,?,?,?,?,?,?,?,?)
`)
for (const i of mockInventoryItems) {
  insertInv.run(i.id, i.projectId, i.assetNo, i.assetName, i.bookValue, i.fieldValue,
    i.diff, i.diffReason, i.status, i.handler, i.handleTime)
}

const insertDoc = sqlite.prepare(`
  INSERT OR IGNORE INTO documents
    (id, project_id, stage, category, name, size, uploaded_by, uploaded_at, status)
  VALUES (?,?,?,?,?,?,?,?,?)
`)
for (const d of mockDocuments) {
  insertDoc.run(d.id, d.projectId, d.stage, d.category, d.name, d.size, d.uploadedBy, d.uploadedAt, d.status)
}

const insertUser = sqlite.prepare(`
  INSERT OR IGNORE INTO users (id, username, name, role, department, email, status)
  VALUES (?,?,?,?,?,?,'active')
`)
for (const u of mockUsers) {
  insertUser.run(u.id, u.username, u.name, JSON.stringify(u.roles), u.department, u.email)
}

// seed stage_pre_work for project 1
sqlite.prepare(`INSERT OR IGNORE INTO stage_pre_work
  (project_id, contract_no, client_name, sign_date, amount, plan_start, plan_end, members, erp_status, updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?)`)
  .run('1','HT-2024-001','某科技股份有限公司','2024-01-20',150000,'2024-02-01','2024-03-31',
    JSON.stringify(['张伟','李娜']), JSON.stringify(['contractSigned','listLocked','staffArranged']),
    '2024-01-20 10:00:00')

// seed stage_confirmation for project 4 (confirmed)
sqlite.prepare(`INSERT OR IGNORE INTO stage_confirmation
  (project_id, report_no, original_value, net_value, assessed_value, method, assessment_org, assessor, client_feedback, confirmed_at, confirmed_by, updated_at)
  VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`)
  .run('4','RPT-2024-004',450000,450000,432000,'market','内部评估部','孙评估师','评估结论合理，已接受',
    '2024-05-10 14:30:00','赵敏','2024-05-10 14:30:00')

// seed stage_archive for project 5 (archived)
sqlite.prepare(`INSERT OR IGNORE INTO stage_archive
  (project_id, archive_no, archivist, archive_date, retention_years, storage_location, updated_at)
  VALUES (?,?,?,?,?,?,?)`)
  .run('5','ARC-2024-001','张伟','2024-06-15',10,'电子档案系统','2024-06-15 16:00:00')

// seed assessment_purposes
const purposeData = [
  { id: 'ap-1', name: '股权转让评估', sortOrder: 1 },
  { id: 'ap-2', name: '抵押贷款评估', sortOrder: 2 },
  { id: 'ap-3', name: '资产处置评估', sortOrder: 3 },
  { id: 'ap-4', name: '企业清算评估', sortOrder: 4 },
  { id: 'ap-5', name: '司法鉴定评估', sortOrder: 5 },
  { id: 'ap-6', name: '企业重组评估', sortOrder: 6 },
  { id: 'ap-7', name: '融资评估',     sortOrder: 7 },
]
const insertPurpose = sqlite.prepare(`
  INSERT OR IGNORE INTO assessment_purposes (id, name, sort_order, enabled)
  VALUES (?, ?, ?, 1)
`)
for (const p of purposeData) insertPurpose.run(p.id, p.name, p.sortOrder)

// seed assessment_methods
const methodData = [
  { id: 'am-1', name: '市场法',    sortOrder: 1 },
  { id: 'am-2', name: '收益法',    sortOrder: 2 },
  { id: 'am-3', name: '成本法',    sortOrder: 3 },
  { id: 'am-4', name: '假设开发法', sortOrder: 4 },
]
const insertMethod = sqlite.prepare(`
  INSERT OR IGNORE INTO assessment_methods (id, name, sort_order, enabled)
  VALUES (?, ?, ?, 1)
`)
for (const m of methodData) insertMethod.run(m.id, m.name, m.sortOrder)

// seed roles
const rolesData = [
  { id: 'r1', key: 'admin',         label: '系统管理员',   tagType: 'danger',  sortOrder: 1,
    permissions: [11,12,13,14,21,22,23,31,32,33,41,42,43,51,52,53,54,61,62,63,71,72,73] },
  { id: 'r2', key: 'assessor',      label: '评估专业人员', tagType: 'primary', sortOrder: 2,
    permissions: [11,12,13,14,21,22,23,31,32,41,42,61,63] },
  { id: 'r3', key: 'deptManager',   label: '部门负责人',   tagType: 'warning', sortOrder: 3,
    permissions: [11,13,21,22,23,31,32,41,42,43,51,52,61,62,63] },
  { id: 'r4', key: 'chiefEngineer', label: '总师室',       tagType: 'warning', sortOrder: 4,
    permissions: [11,13,21,22,23,31,32,41,42,43,51,52,53,61,62,63] },
  { id: 'r5', key: 'ceo',           label: '总经理',       tagType: 'success', sortOrder: 5,
    permissions: [11,13,14,21,23,31,32,41,43,51,52,53,54,61,62,63] },
  { id: 'r6', key: 'riskControl',   label: '风控',         tagType: '',        sortOrder: 6,
    permissions: [11,13,14,21,31,41,51,52,61] },
]
const insertRole = sqlite.prepare(`
  INSERT OR IGNORE INTO roles (id, key, label, tag_type, permissions, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`)
for (const r of rolesData) {
  insertRole.run(r.id, r.key, r.label, r.tagType, JSON.stringify(r.permissions), r.sortOrder)
}

// seed flow_configs
const flowConfigData = [
  {
    id: 'fc-1', name: '评估立项审批', scene: '新建评估立项', sortOrder: 1,
    nodes: [
      { role: '部门负责人', approvers: [{ name: '李经理',    username: 'li.manager' }] },
      { role: '风控',       approvers: [{ name: '王风控',    username: 'wang.riskctrl' }] },
      { role: '办公室',     approvers: [{ name: '办公室主任', username: 'office.chief' }] },
      { role: '总经理',     approvers: [{ name: '陈总',      username: 'chen.ceo' }] },
    ],
  },
  {
    id: 'fc-2', name: '前期工作审批', scene: '合同签订、计划制定', sortOrder: 2,
    nodes: [
      { role: '部门负责人', approvers: [{ name: '李经理',    username: 'li.manager' }] },
      { role: '办公室',     approvers: [{ name: '办公室主任', username: 'office.chief' }] },
      { role: '总经理',     approvers: [{ name: '陈总',      username: 'chen.ceo' }] },
    ],
  },
  {
    id: 'fc-3', name: '评估结果审核', scene: '评估报告内部审核', sortOrder: 3,
    nodes: [
      { role: '部门负责人', approvers: [{ name: '李经理',    username: 'li.manager' }] },
      { role: '总师室',     approvers: [{ name: '王风控',    username: 'wang.riskctrl' }] },
      { role: '总经理',     approvers: [{ name: '陈总',      username: 'chen.ceo' }] },
    ],
  },
  {
    id: 'fc-4', name: '结果确认审批', scene: '评估结果确认单', sortOrder: 4,
    nodes: [
      { role: '部门负责人', approvers: [{ name: '李经理',    username: 'li.manager' }] },
      { role: '总经理',     approvers: [{ name: '陈总',      username: 'chen.ceo' }] },
    ],
  },
  {
    id: 'fc-5', name: '报告归档审批', scene: '报告归档', sortOrder: 5, enabled: 0,
    nodes: [
      { role: '部门负责人', approvers: [{ name: '李经理',    username: 'li.manager' }] },
      { role: '总经理',     approvers: [{ name: '陈总',      username: 'chen.ceo' }] },
    ],
  },
]
const insertFlowConfig = sqlite.prepare(`
  INSERT OR IGNORE INTO flow_configs (id, name, scene, nodes, sort_order, enabled)
  VALUES (?, ?, ?, ?, ?, ?)
`)
for (const fc of flowConfigData) {
  insertFlowConfig.run(fc.id, fc.name, fc.scene, JSON.stringify(fc.nodes), fc.sortOrder, fc.enabled ?? 1)
}

console.log('✅ Seed complete')
sqlite.close()

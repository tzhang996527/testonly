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
  created_by TEXT,
  pre_work_data TEXT DEFAULT '{}',
  review_erp_status TEXT DEFAULT '[]',
  attachments TEXT DEFAULT '{}'
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
  { id: '1', projectId: '1', category: 'ownership', name: '房产证-A101.pdf', size: '2.1MB', uploadedBy: '张伟', uploadedAt: '2024-02-15 10:00:00', status: 'verified' },
  { id: '2', projectId: '1', category: 'financial', name: '近三年审计报告.pdf', size: '5.3MB', uploadedBy: '张伟', uploadedAt: '2024-02-15 10:30:00', status: 'verified' },
  { id: '3', projectId: '1', category: 'technical', name: '机床使用说明书.pdf', size: '1.2MB', uploadedBy: '李娜', uploadedAt: '2024-02-16 09:00:00', status: 'verified' },
  { id: '4', projectId: '1', category: 'external', name: '市场报价单.xlsx', size: '0.8MB', uploadedBy: '李娜', uploadedAt: '2024-02-16 14:00:00', status: 'pending' },
  { id: '5', projectId: '2', category: 'ownership', name: '设备购置发票.pdf', size: '0.5MB', uploadedBy: '李娜', uploadedAt: '2024-03-10 10:00:00', status: 'verified' },
]

const mockUsers = [
  { id: '1', username: 'admin',        name: '系统管理员', role: 'admin',       department: '信息中心',   email: 'admin@company.com' },
  { id: '2', username: 'zhang.wei',    name: '张伟',       role: 'assessor',    department: '资产评估部', email: 'zhang.wei@company.com' },
  { id: '3', username: 'li.na',        name: '李娜',       role: 'assessor',    department: '资产评估部', email: 'li.na@company.com' },
  { id: '4', username: 'wang.lei',     name: '王磊',       role: 'assessor',    department: '资产评估部', email: 'wang.lei@company.com' },
  { id: '5', username: 'zhao.min',     name: '赵敏',       role: 'deptManager', department: '资产评估部', email: 'zhao.min@company.com' },
  { id: '6', username: 'li.manager',   name: '李经理',     role: 'deptManager', department: '资产评估部', email: 'li.manager@company.com' },
  { id: '7', username: 'wang.riskctrl',name: '王风控',     role: 'riskControl', department: '风控部',     email: 'wang.riskctrl@company.com' },
  { id: '8', username: 'office.chief', name: '办公室主任', role: 'office',      department: '办公室',     email: 'office@company.com' },
  { id: '9', username: 'chen.ceo',     name: '陈总',       role: 'ceo',         department: '总经理室',   email: 'ceo@company.com' },
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
    (id, project_id, category, name, size, uploaded_by, uploaded_at, status)
  VALUES (?,?,?,?,?,?,?,?)
`)
for (const d of mockDocuments) {
  insertDoc.run(d.id, d.projectId, d.category, d.name, d.size, d.uploadedBy, d.uploadedAt, d.status)
}

const insertUser = sqlite.prepare(`
  INSERT OR IGNORE INTO users (id, username, name, role, department, email, status)
  VALUES (?,?,?,?,?,?,'active')
`)
for (const u of mockUsers) {
  insertUser.run(u.id, u.username, u.name, u.role, u.department, u.email)
}

console.log('✅ Seed complete')
sqlite.close()

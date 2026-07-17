import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const projects = sqliteTable('projects', {
  id:          text('id').primaryKey(),
  projectNo:   text('project_no').notNull(),
  purpose:     text('purpose').notNull(),
  baseDate:    text('base_date'),
  assetCategory: text('asset_category'),
  responsible: text('responsible'),
  department:  text('department'),
  status:      text('status').notNull().default('draft'),
  currentStep: integer('current_step').notNull().default(1),
  remark:      text('remark'),
  createdAt:   text('created_at'),
  createdBy:   text('created_by'),
  // JSON columns — store arrays/objects as serialised JSON
  approvals:        text('approvals').default('[]'),
  preWorkApprovals: text('pre_work_approvals').default('[]'),
  reviewApprovals:  text('review_approvals').default('[]'),
  preWorkData:      text('pre_work_data').default('{}'),
  reviewErpStatus:  text('review_erp_status').default('[]'),
  attachments:      text('attachments').default('{}'),
})

export const assets = sqliteTable('assets', {
  id:            text('id').primaryKey(),
  projectId:     text('project_id').notNull(),
  assetNo:       text('asset_no'),
  assetName:     text('asset_name'),
  spec:          text('spec'),
  location:      text('location'),
  ownershipNo:   text('ownership_no'),
  originalValue: real('original_value').default(0),
  netValue:      real('net_value').default(0),
  assessedValue: real('assessed_value').default(0),
  method:        text('method'),
  assessor:      text('assessor'),
  reportNo:      text('report_no'),
})

export const inventoryItems = sqliteTable('inventory_items', {
  id:          text('id').primaryKey(),
  projectId:   text('project_id').notNull(),
  assetNo:     text('asset_no'),
  assetName:   text('asset_name'),
  bookValue:   real('book_value').default(0),
  fieldValue:  real('field_value').default(0),
  diff:        real('diff').default(0),
  diffReason:  text('diff_reason'),
  status:      text('status').default('pending'),
  handler:     text('handler'),
  handleTime:  text('handle_time'),
})

export const documents = sqliteTable('documents', {
  id:          text('id').primaryKey(),
  projectId:   text('project_id').notNull(),
  category:    text('category'),
  name:        text('name'),
  size:        text('size'),
  storedName:  text('stored_name'),
  uploadedBy:  text('uploaded_by'),
  uploadedAt:  text('uploaded_at'),
  status:      text('status').default('pending'),
})

export const users = sqliteTable('users', {
  id:         text('id').primaryKey(),
  username:   text('username').notNull().unique(),
  name:       text('name'),
  role:       text('role'),
  department: text('department'),
  email:      text('email'),
  status:     text('status').default('active'),
  password:   text('password').default('123456'),
})

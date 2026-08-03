import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

export const projects = sqliteTable('projects', {
  id:            text('id').primaryKey(),
  projectNo:     text('project_no').notNull(),
  purpose:       text('purpose').notNull(),
  baseDate:      text('base_date'),
  assetCategory: text('asset_category'),
  responsible:   text('responsible'),
  department:    text('department'),
  status:        text('status').notNull().default('draft'),
  currentStep:   integer('current_step').notNull().default(1),
  remark:        text('remark'),
  createdAt:     text('created_at'),
  createdBy:     text('created_by'),
  budgetHours:   real('budget_hours').default(0),   // 预算工时（小时）
  actualHours:   real('actual_hours').default(0),   // 实际用时（小时）
})

// One row per approval node per stage per project.
export const approvalNodes = sqliteTable('approval_nodes', {
  id:         text('id').primaryKey(),
  projectId:  text('project_id').notNull(),
  stage:      text('stage').notNull(),
  nodeIndex:  integer('node_index').notNull(),
  role:       text('role').notNull(),
  nodeStatus: text('node_status').notNull().default('pending'),
  approvers:  text('approvers').notNull().default('[]'),
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
  stage:       text('stage').notNull().default(''),   // which stage this file belongs to
  category:    text('category'),                       // sub-category within the stage
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

export const roles = sqliteTable('roles', {
  id:          text('id').primaryKey(),
  key:         text('key').notNull().unique(),
  label:       text('label').notNull(),
  tagType:     text('tag_type').default(''),
  permissions: text('permissions').notNull().default('[]'), // JSON number[]
  sortOrder:   integer('sort_order').notNull().default(0),
})

// ── Stage data tables (one row per project) ──────────────────────────────────

// stage: pre-work
export const stagePreWork = sqliteTable('stage_pre_work', {
  projectId:    text('project_id').primaryKey(),
  contractNo:   text('contract_no'),
  clientName:   text('client_name'),
  signDate:     text('sign_date'),
  amount:       real('amount').default(0),
  planStart:    text('plan_start'),
  planEnd:      text('plan_end'),
  members:      text('members').default('[]'),    // JSON string[]
  erpStatus:    text('erp_status').default('[]'), // JSON string[]
  updatedAt:    text('updated_at'),
})

// stage: inventory
export const stageInventory = sqliteTable('stage_inventory', {
  projectId:       text('project_id').primaryKey(),
  surveyDate:      text('survey_date'),
  surveyPersonnel: text('survey_personnel'),
  surveyDesc:      text('survey_desc'),
  erpStatus:       text('erp_status').default('[]'),
  updatedAt:       text('updated_at'),
})

// stage: collection
export const stageCollection = sqliteTable('stage_collection', {
  projectId: text('project_id').primaryKey(),
  erpStatus: text('erp_status').default('[]'),
  updatedAt: text('updated_at'),
})

// stage: estimation
export const stageEstimation = sqliteTable('stage_estimation', {
  projectId: text('project_id').primaryKey(),
  erpStatus: text('erp_status').default('[]'),
  updatedAt: text('updated_at'),
})

// stage: review
export const stageReview = sqliteTable('stage_review', {
  projectId: text('project_id').primaryKey(),
  erpStatus: text('erp_status').default('[]'),
  updatedAt: text('updated_at'),
})

// stage: confirmation
export const stageConfirmation = sqliteTable('stage_confirmation', {
  projectId:      text('project_id').primaryKey(),
  reportNo:       text('report_no'),
  originalValue:  real('original_value').default(0),
  netValue:       real('net_value').default(0),
  assessedValue:  real('assessed_value').default(0),
  method:         text('method'),
  assessmentOrg:  text('assessment_org'),
  assessor:       text('assessor'),
  clientFeedback: text('client_feedback'),
  confirmedAt:    text('confirmed_at'),
  confirmedBy:    text('confirmed_by'),
  updatedAt:      text('updated_at'),
})

// stage: archive
export const stageArchive = sqliteTable('stage_archive', {
  projectId:        text('project_id').primaryKey(),
  archiveNo:        text('archive_no'),
  archivist:        text('archivist'),
  archiveDate:      text('archive_date'),
  retentionYears:   integer('retention_years').default(10),
  storageLocation:  text('storage_location'),
  updatedAt:        text('updated_at'),
})

// ── Config tables ─────────────────────────────────────────────────────────────

export const flowConfigs = sqliteTable('flow_configs', {
  id:        text('id').primaryKey(),
  name:      text('name').notNull(),
  scene:     text('scene'),
  nodes:     text('nodes').notNull().default('[]'), // JSON: [{role, approvers:[{name,username}]}]
  sortOrder: integer('sort_order').notNull().default(0),
  enabled:   integer('enabled').notNull().default(1),
})

export const assessmentPurposes = sqliteTable('assessment_purposes', {
  id:        text('id').primaryKey(),
  name:      text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  enabled:   integer('enabled').notNull().default(1), // 1=true, 0=false
})

export const assessmentMethods = sqliteTable('assessment_methods', {
  id:        text('id').primaryKey(),
  name:      text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  enabled:   integer('enabled').notNull().default(1),
})

// stage: tracking — multiple rows per project
export const trackingRecords = sqliteTable('tracking_records', {
  id:        text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  type:      text('type'),       // usage | valueChange | legal | other
  date:      text('date'),
  content:   text('content'),
  recorder:  text('recorder'),
  createdAt: text('created_at'),
})

// ── Work log: weekly plans & summaries ───────────────────────────────────────

// One plan+summary record per user per week (identified by weekStart YYYY-MM-DD Monday)
export const workWeeklyLogs = sqliteTable('work_weekly_logs', {
  id:          text('id').primaryKey(),
  userId:      text('user_id').notNull(),
  userName:    text('user_name'),
  weekStart:   text('week_start').notNull(),  // Monday date YYYY-MM-DD
  // next-week plan (filled on Friday for next week)
  planNote:    text('plan_note').default(''), // free-text overall plan note
  // this-week summary (filled on Friday for current week)
  summaryNote: text('summary_note').default(''),
  createdAt:   text('created_at'),
  updatedAt:   text('updated_at'),
})

// Individual daily entries within a plan (one row per project-day)
export const workPlanEntries = sqliteTable('work_plan_entries', {
  id:              text('id').primaryKey(),
  weeklyLogId:     text('weekly_log_id').notNull(),
  userId:          text('user_id').notNull(),
  weekStart:       text('week_start').notNull(),
  entryDate:       text('entry_date').notNull(),     // YYYY-MM-DD
  projectId:       text('project_id'),               // null = non-project work
  projectNo:       text('project_no'),
  projectName:     text('project_name'),             // denormalized purpose for display
  workType:        text('work_type').default('office'), // 'office' | 'field'
  plannedHours:    real('planned_hours').default(0),
  actualHours:     real('actual_hours').default(0),
  plannedProgress: real('planned_progress').default(0), // % 0-100
  actualProgress:  real('actual_progress').default(0),
  note:            text('note').default(''),
  delayReason:     text('delay_reason').default(''),  // if actual < planned
  entryType:       text('entry_type').default('plan'), // 'plan' | 'summary'
  createdAt:       text('created_at'),
  updatedAt:       text('updated_at'),
})

// ── G-7 专家（专业人员）申请表 ────────────────────────────────────────────────
export const experts = sqliteTable('experts', {
  id:              text('id').primaryKey(),
  // 申请信息
  projectName:     text('project_name').default(''),
  problemToSolve:  text('problem_to_solve').default(''),
  budget:          text('budget').default(''),
  approver:        text('approver').default(''),
  approveDate:     text('approve_date').default(''),
  // 专家简况
  name:            text('name').default(''),
  gender:          text('gender').default(''),
  birthDate:       text('birth_date').default(''),
  education:       text('education').default(''),
  degree:          text('degree').default(''),
  techTitle:       text('tech_title').default(''),
  address:         text('address').default(''),
  phone:           text('phone').default(''),
  email:           text('email').default(''),
  workUnit:        text('work_unit').default(''),
  workPhone:       text('work_phone').default(''),
  expertise:       text('expertise').default(''),
  experience:      text('experience').default(''),
  remark:          text('remark').default(''),
  // 填表信息
  filledBy:        text('filled_by').default(''),
  fillDate:        text('fill_date').default(''),
  createdAt:       text('created_at'),
  updatedAt:       text('updated_at'),
  createdBy:       text('created_by'),
})

// ── Change audit log ──────────────────────────────────────────────────────────
export const changeLogs = sqliteTable('change_logs', {
  id:               text('id').primaryKey(),
  entityType:       text('entity_type').notNull(),   // 'project' | 'asset' | 'inventory_item' | stage keys
  entityId:         text('entity_id').notNull(),
  projectId:        text('project_id'),              // denormalized for fast per-project queries
  action:           text('action').notNull(),         // 'create' | 'update' | 'delete'
  fieldChanges:     text('field_changes').notNull().default('[]'), // JSON: [{field,fieldLabel,oldValue,newValue}]
  operatorId:       text('operator_id'),
  operatorName:     text('operator_name'),
  operatorUsername: text('operator_username'),
  operatorIp:       text('operator_ip'),
  operatedAt:       text('operated_at').notNull(),
})

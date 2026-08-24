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
  projectId: text('project_id').primaryKey(),
  erpStatus: text('erp_status').default('[]'),
  updatedAt: text('updated_at'),
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

// ── Scratch forms (底稿) — G-1 / G-2 / G-28 ─────────────────────────────────

// G-1 评估业务基本事项调查表 (one row per project+stage)
export const scratchG1 = sqliteTable('scratch_g1', {
  id:                text('id').primaryKey(),
  projectId:         text('project_id').notNull(),
  stage:             text('stage').notNull().default('overview'),
  projectName:       text('project_name').default(''),
  client:            text('client').default(''),
  clientContact:     text('client_contact').default(''),
  clientPhone:       text('client_phone').default(''),
  unitName:          text('unit_name').default(''),
  unitAddress:       text('unit_address').default(''),
  legalRep:          text('legal_rep').default(''),
  enterpriseType:    text('enterprise_type').default(''),
  registeredCapital: text('registered_capital').default(''),
  unitContact:       text('unit_contact').default(''),
  unitPhone:         text('unit_phone').default(''),
  businessScope:     text('business_scope').default(''),
  otherReportUsers:  text('other_report_users').default(''),
  relationship:      text('relationship').default(''),
  approvalStatus:    text('approval_status').default(''),
  importantMatters:  text('important_matters').default(''),
  assessmentPurpose: text('assessment_purpose').default(''),
  assessmentScope:   text('assessment_scope').default(''),
  assetStatus:       text('asset_status').default(''),
  valueType:         text('value_type').default(''),
  baseDate:          text('base_date').default(''),
  assumptions:       text('assumptions').default(''),
  reportUsage:       text('report_usage').default(''),
  serviceFee:        real('service_fee').default(0),
  negotiator:        text('negotiator').default(''),
  approver:          text('approver').default(''),
  approveDate:       text('approve_date').default(''),
  formFiller:        text('form_filler').default(''),
  updatedAt:         text('updated_at'),
})

// G-2 评估项目综合评价表 (one row per project+stage)
export const scratchG2 = sqliteTable('scratch_g2', {
  id:             text('id').primaryKey(),
  projectId:      text('project_id').notNull(),
  stage:          text('stage').notNull().default('overview'),
  section1:       text('section1').default('[]'),   // 对委托人综合评价 (6题) JSON [{q,a}]
  section2:       text('section2').default('[]'),   // 对被评估单位综合评价 (9题)
  section3:       text('section3').default('[]'),   // 对评估对象的综合评价 (3题)
  section4:       text('section4').default('[]'),   // 对本机构及评估人员 (5题)
  section5:       text('section5').default('[]'),   // 评估报告使用风险影响 (4题)
  riskLevel:      text('risk_level').default('一般'),
  riskDesc:       text('risk_desc').default(''),
  accepted:       integer('accepted').default(1),
  negotiator:     text('negotiator').default(''),
  negotiateDate:  text('negotiate_date').default(''),
  supervisorNote: text('supervisor_note').default(''),
  supervisorDate: text('supervisor_date').default(''),
  updatedAt:      text('updated_at'),
})

// G-28 项目组成员独立性调查问卷 (multiple rows per project+stage, one per member)
export const scratchG28 = sqliteTable('scratch_g28', {
  id:          text('id').primaryKey(),
  projectId:   text('project_id').notNull(),
  stage:       text('stage').notNull().default('overview'),
  memberName:  text('member_name').default(''),
  answers:     text('answers').default('[]'),   // JSON: ['yes'|'no'|'na', ...] 18 items
  signDate:    text('sign_date').default(''),
  createdAt:   text('created_at'),
  updatedAt:   text('updated_at'),
})

// G-4 评估项目工作计划表 (one row per project+stage)
export const scratchG4 = sqliteTable('scratch_g4', {
  id:             text('id').primaryKey(),
  projectId:      text('project_id').notNull(),
  stage:          text('stage').notNull().default('pre-work'),
  projectName:    text('project_name').default(''),
  purpose:        text('purpose').default(''),
  baseDate:       text('base_date').default(''),
  valueType:      text('value_type').default(''),
  scope:          text('scope').default(''),
  schedule:       text('schedule').default('[]'),   // JSON array [{responsible, startDate, endDate}]
  staff:          text('staff').default('[]'),       // JSON array [{person}]
  budget:         text('budget').default('{}'),      // JSON {labor, travel, field, overtime, other}
  approver:       text('approver').default(''),
  approveDate:    text('approve_date').default(''),
  adjustment:     text('adjustment').default(''),
  adjustApprover: text('adjust_approver').default(''),
  adjustDate:     text('adjust_date').default(''),
  remark:         text('remark').default(''),
  preparer:       text('preparer').default(''),
  reviewer:       text('reviewer').default(''),
  updatedAt:      text('updated_at'),
})

// G-5 资料清单 (one row per project+stage)
export const scratchG5 = sqliteTable('scratch_g5', {
  id:        text('id').primaryKey(),
  projectId: text('project_id').notNull(),
  stage:     text('stage').notNull().default('pre-work'),
  items:     text('items').default('[]'),   // JSON array [{needDate, providedDate, signer, remark}]
  updatedAt: text('updated_at'),
})

// G-27 现场勘查记录表 (one row per project+stage)
export const scratchG27 = sqliteTable('scratch_g27', {
  id:               text('id').primaryKey(),
  projectId:        text('project_id').notNull(),
  stage:            text('stage').notNull().default('inventory'),
  objectName:       text('object_name').default(''),        // 勘查对象名称
  surveyDate:       text('survey_date').default(''),        // 勘察日期
  surveyor:         text('surveyor').default(''),           // 勘查人员
  contactPerson:    text('contact_person').default(''),     // 接洽人员
  location:         text('location').default(''),           // 勘查对象所处位置
  environment:      text('environment').default(''),        // 勘查对象周围环境
  conclusion:       text('conclusion').default(''),         // 勘查结论
  firstSignature:   text('first_signature').default(''),    // 接待方签字（盖章）
  secondTime:       text('second_time').default(''),        // 第二次勘查时间
  secondSurveyor:   text('second_surveyor').default(''),    // 勘查人员
  secondContact:    text('second_contact').default(''),     // 接洽人员
  secondConclusion: text('second_conclusion').default(''),  // 勘查结论
  secondSignature:  text('second_signature').default(''),   // 接待方签字（盖章）
  thirdTime:        text('third_time').default(''),         // 第三次勘查时间
  thirdSurveyor:    text('third_surveyor').default(''),     // 勘查人员
  thirdContact:     text('third_contact').default(''),      // 接洽人员
  thirdConclusion:  text('third_conclusion').default(''),   // 勘查结论
  thirdSignature:   text('third_signature').default(''),    // 接待方签字（盖章）
  updatedAt:        text('updated_at'),
})

// C3-1-1/2 库存现金作业分析表 (one row per project+stage)
export const scratchC3 = sqliteTable('scratch_c3', {
  id:                     text('id').primaryKey(),
  projectId:              text('project_id').notNull(),
  stage:                  text('stage').notNull().default('inventory'),
  unitName:               text('unit_name').default(''),              // 被评估单位
  baseDate:               text('base_date').default(''),              // 评估基准日
  pageTotal:              text('page_total').default(''),             // 页次 共
  pageNo:                 text('page_no').default(''),                // 页次 第
  denominations:          text('denominations').default('[]'),        // JSON [{denom,fcCount,fcAmount,rmbCount,rmbAmount}]
  total:                  text('total').default('{}'),                // JSON {fcCount,fcAmount,rmbCount,rmbAmount}
  exchangeRate:           text('exchange_rate').default(''),          // 即期汇率
  rmbNote:                text('rmb_note').default(''),               // 人民币
  checkDate:              text('check_date').default(''),             // 清查日期
  inventoryBalance:       text('inventory_balance').default(''),      // 清查日盘点库存现金余额
  addUnrecordedExpense:   text('add_unrecorded_expense').default(''),  // 加:基准日至清查日支出未记账
  minusUnrecordedIncome:  text('minus_unrecorded_income').default(''), // 减:基准日至清查日收入未记账
  addRecordedExpense:     text('add_recorded_expense').default(''),    // 加:基准日至清查日支出已记账
  minusRecordedIncome:    text('minus_recorded_income').default(''),   // 减:基准日至清查日收入已记账
  adjustedBookValue:      text('adjusted_book_value').default(''),     // 平衡法调整后账面值
  baseBookValue:          text('base_book_value').default(''),         // 评估基准日账面值
  longAmount:             text('long_amount').default(''),             // 长款金额
  shortAmount:            text('short_amount').default(''),            // 短款金额
  appraisedValue:         text('appraised_value').default(''),         // 评估价值
  reasonAnalysis:         text('reason_analysis').default(''),         // 原因分析
  storageLocation:        text('storage_location').default(''),        // 库存现金保管地点
  cashierSign:            text('cashier_sign').default(''),            // 出纳签字
  accountingSupervisor:   text('accounting_supervisor').default(''),   // 会计主管
  monitorPerson:          text('monitor_person').default(''),          // 评估监盘人员
  filler:                 text('filler').default(''),                  // 填表人
  reviewer:               text('reviewer').default(''),                // 复核人
  updatedAt:              text('updated_at'),
})

// ── Change audit log ──────────────────────────────────────────────────────────
export const changeLogs = sqliteTable('change_logs', {
  id:               text('id').primaryKey(),
  entityType:       text('entity_type').notNull(),   // 'project' | 'asset' | stage keys
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

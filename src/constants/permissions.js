// Permission IDs — must stay in sync with RoleManage.vue permTree and seed.js
export const PERM = {
  // ── 评估立项 ─────────────────────────────────────
  PROJECT_VIEW:   11,
  PROJECT_CREATE: 12,
  PROJECT_EDIT:   13,
  PROJECT_SUBMIT: 14,

  // ── 清查盘点 ─────────────────────────────────────
  INVENTORY_VIEW:   21,
  INVENTORY_INPUT:  22,
  INVENTORY_DIFF:   23,

  // ── 资料收集 ─────────────────────────────────────
  COLLECTION_VIEW:   31,
  COLLECTION_UPLOAD: 32,
  COLLECTION_DELETE: 33,

  // ── 评定估算 ─────────────────────────────────────
  ESTIMATION_VIEW:   41,
  ESTIMATION_INPUT:  42,
  ESTIMATION_EDIT:   43,

  // ── 审核审批 ─────────────────────────────────────
  REVIEW_VIEW:    51,
  REVIEW_L1:      52,
  REVIEW_L2:      53,
  REVIEW_FINAL:   54,

  // ── 资产台账 ─────────────────────────────────────
  ASSETS_VIEW:   61,
  ASSETS_EDIT:   62,
  ASSETS_EXPORT: 63,

  // ── 报表中心 ─────────────────────────────────────
  REPORTS_VIEW: 81,

  // ── 会计 ─────────────────────────────────────────
  ACCOUNTING_VIEW:   91,
  ACCOUNTING_EDIT:   92,
  ACCOUNTING_EXPORT: 93,

  // ── 工程核算 ──────────────────────────────────────
  ENGINEERING_VIEW:   101,
  ENGINEERING_EDIT:   102,
  ENGINEERING_EXPORT: 103,

  // ── 人事 ─────────────────────────────────────────
  HR_VIEW:   111,
  HR_EDIT:   112,
  HR_EXPORT: 113,

  // ── 工作日志 ──────────────────────────────────────
  WORKLOG_VIEW:     121,
  WORKLOG_EDIT:     122,
  WORKLOG_VIEW_ALL: 123,

  // ── G-7 专家管理 ──────────────────────────────────
  EXPERT_VIEW:   131,
  EXPERT_EDIT:   132,
  EXPERT_DELETE: 133,

  // ── 系统管理 ─────────────────────────────────────
  ADMIN_USERS: 71,
  ADMIN_ROLES: 72,
  ADMIN_FLOW:  73,
  CHANGE_LOGS_VIEW:   74,
  CHANGE_LOGS_DELETE: 75,
}

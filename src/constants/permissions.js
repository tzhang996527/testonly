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

  // ── 系统管理 ─────────────────────────────────────
  ADMIN_USERS: 71,
  ADMIN_ROLES: 72,
  ADMIN_FLOW:  73,
}

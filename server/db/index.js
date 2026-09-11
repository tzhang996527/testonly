import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema.js'
import { DB_PATH } from '../config/paths.js'

const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')

// 自动补全缺失列（新增字段时无需手动迁移）
function migrate() {
  const existing = new Set(
    sqlite.prepare('PRAGMA table_info(projects)').all().map(c => c.name)
  )
  // 全新数据库（Volume 首次挂载）此时还没有任何表——交给 seed 创建，这里直接跳过。
  if (existing.size === 0) return
  const cols = [
    ['contract_no',             'TEXT DEFAULT ""'],
    ['report_date',             'TEXT DEFAULT ""'],
    ['assessment_object',       'TEXT DEFAULT ""'],
    ['assessment_scope',        'TEXT DEFAULT ""'],
    ['value_type',              'TEXT DEFAULT ""'],
    ['client',                  'TEXT DEFAULT ""'],
    ['unit_name',               'TEXT DEFAULT ""'],
    ['schedule',                'TEXT DEFAULT "[]"'],
    ['personnel',               'TEXT DEFAULT "{}"'],
    ['agreed_fee',              'REAL DEFAULT 0'],
    ['actual_fee',              'REAL DEFAULT 0'],
    ['client_contact',          'TEXT DEFAULT ""'],
    ['client_phone',            'TEXT DEFAULT ""'],
    ['unit_registered_capital', 'TEXT DEFAULT ""'],
    ['unit_address',            'TEXT DEFAULT ""'],
    ['unit_legal_rep',          'TEXT DEFAULT ""'],
    ['unit_enterprise_type',    'TEXT DEFAULT ""'],
    ['unit_contact',            'TEXT DEFAULT ""'],
    ['unit_phone',              'TEXT DEFAULT ""'],
    ['unit_business_scope',     'TEXT DEFAULT ""'],
    ['other_report_users',      'TEXT DEFAULT ""'],
    ['relationship',            'TEXT DEFAULT ""'],
    ['important_matters',       'TEXT DEFAULT ""'],
    ['assumptions',             'TEXT DEFAULT ""'],
    ['approval_required',       'TEXT DEFAULT "否"'],
    ['business_changes',        'TEXT DEFAULT ""'],
    ['expert_hired',            'TEXT DEFAULT ""'],
    ['major_issues',            'TEXT DEFAULT ""'],
    ['site_inspectors',         'TEXT DEFAULT ""'],
    ['site_contacts',           'TEXT DEFAULT ""'],
    ['use_asset_method',        'INTEGER DEFAULT 0'],
    ['use_income_method',       'INTEGER DEFAULT 1'],
    ['use_market_method',       'INTEGER DEFAULT 1'],
  ]
  for (const [col, def] of cols) {
    if (!existing.has(col)) {
      sqlite.prepare(`ALTER TABLE projects ADD COLUMN ${col} ${def}`).run()
    }
  }
}

migrate()

export const db = drizzle(sqlite, { schema })

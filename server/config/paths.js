import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 数据目录：生产环境用 Railway 挂载的持久化 Volume（如 /data），
// 本地开发默认回退到项目根目录，保持原有行为不变。
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '../..')

export const DB_PATH = path.join(DATA_DIR, 'erp.db')
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads')

// 确保目录存在（Volume 首次挂载时是空的）
fs.mkdirSync(DATA_DIR, { recursive: true })
fs.mkdirSync(UPLOADS_DIR, { recursive: true })

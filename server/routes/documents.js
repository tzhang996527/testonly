import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { db } from '../db/index.js'
import { documents } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const ext = path.extname(file.originalname)
    const base = path.basename(file.originalname, ext).replace(/[\\/:*?"<>|]/g, '_')
    const now = new Date()
    const ts = now.getFullYear().toString()
      + String(now.getMonth() + 1).padStart(2, '0')
      + String(now.getDate()).padStart(2, '0')
      + '_'
      + String(now.getHours()).padStart(2, '0')
      + String(now.getMinutes()).padStart(2, '0')
      + String(now.getSeconds()).padStart(2, '0')
      + String(now.getMilliseconds()).padStart(3, '0')
    cb(null, `${base}-${ts}${ext}`)
  },
})

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } })

const router = Router()

// GET /api/documents/:projectId?stage=xxx
router.get('/:projectId', async (req, res) => {
  const { stage } = req.query
  let rows = await db.select().from(documents)
    .where(eq(documents.projectId, req.params.projectId))
  if (stage) rows = rows.filter(r => r.stage === stage)
  res.json({ data: rows })
})

// POST /api/documents/upload — fields: file, projectId, stage, category, uploadedBy
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '未收到文件' })
  const allRows = await db.select().from(documents)
  const sizeKB = req.file.size / 1024
  const size = sizeKB >= 1024
    ? (sizeKB / 1024).toFixed(1) + ' MB'
    : sizeKB.toFixed(0) + ' KB'
  const doc = {
    id:         String(allRows.length + 1),
    projectId:  req.body.projectId || '',
    stage:      req.body.stage     || '',
    category:   req.body.category  || 'other',
    name:       req.file.originalname,
    size,
    storedName: req.file.filename,
    uploadedBy: req.body.uploadedBy || req.user?.name || '当前用户',
    uploadedAt: new Date().toLocaleString('zh-CN'),
    status:     'pending',
  }
  await db.insert(documents).values(doc)
  res.json({ data: doc })
})

// GET /api/documents/file/:filename — download
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename)
  res.download(filePath, (err) => {
    if (err) res.status(404).json({ message: '文件不存在' })
  })
})

// DELETE /api/documents/:id
router.delete('/:id', async (req, res) => {
  const [doc] = await db.select().from(documents).where(eq(documents.id, req.params.id))
  if (doc?.storedName) {
    fs.unlink(path.join(UPLOADS_DIR, doc.storedName), () => {})
  }
  await db.delete(documents).where(eq(documents.id, req.params.id))
  res.json({ success: true })
})

export default router

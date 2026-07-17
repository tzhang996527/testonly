import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { db } from '../db/index.js'
import { documents, projects } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const UPLOADS_DIR = path.join(__dirname, '../../uploads')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    // multer receives filename bytes as latin1; re-encode to utf8
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6)
    cb(null, unique + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
})

const router = Router()

// GET /api/documents/:projectId
router.get('/:projectId', async (req, res) => {
  const rows = await db.select().from(documents)
    .where(eq(documents.projectId, req.params.projectId))
  res.json({ data: rows })
})

// POST /api/documents/upload  — multipart/form-data
// fields: file (required), projectId, category, uploadedBy
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '未收到文件' })
  const allRows = await db.select().from(documents)
  const sizeKB = req.file.size / 1024
  const size = sizeKB >= 1024
    ? (sizeKB / 1024).toFixed(1) + ' MB'
    : sizeKB.toFixed(0) + ' KB'
  const doc = {
    id:          String(allRows.length + 1),
    projectId:   req.body.projectId || '',
    category:    req.body.category  || 'other',
    name:        req.file.originalname,
    size,
    storedName:  req.file.filename,
    uploadedBy:  req.body.uploadedBy || '当前用户',
    uploadedAt:  new Date().toLocaleString('zh-CN'),
    status:      'pending',
  }
  await db.insert(documents).values(doc)

  // sync project.attachments
  if (doc.projectId) {
    const [project] = await db.select().from(projects).where(eq(projects.id, doc.projectId))
    if (project) {
      const attachments = JSON.parse(project.attachments || '{}')
      if (!attachments[doc.category]) attachments[doc.category] = []
      attachments[doc.category].push({ name: doc.name, size: doc.size, storedName: doc.storedName })
      await db.update(projects)
        .set({ attachments: JSON.stringify(attachments) })
        .where(eq(projects.id, doc.projectId))
    }
  }

  res.json({ data: doc })
})

// GET /api/documents/file/:filename  — download / preview
router.get('/file/:filename', (req, res) => {
  const filePath = path.join(UPLOADS_DIR, req.params.filename)
  res.download(filePath, (err) => {
    if (err) res.status(404).json({ message: '文件不存在' })
  })
})

// DELETE /api/documents/:id
router.delete('/:id', async (req, res) => {
  const [doc] = await db.select().from(documents).where(eq(documents.id, req.params.id))
  if (doc?.projectId) {
    const [project] = await db.select().from(projects).where(eq(projects.id, doc.projectId))
    if (project) {
      const attachments = JSON.parse(project.attachments || '{}')
      if (attachments[doc.category]) {
        attachments[doc.category] = attachments[doc.category].filter(f => f.storedName !== doc.storedName)
      }
      await db.update(projects)
        .set({ attachments: JSON.stringify(attachments) })
        .where(eq(projects.id, doc.projectId))
    }
  }
  await db.delete(documents).where(eq(documents.id, req.params.id))
  res.json({ success: true })
})

export default router

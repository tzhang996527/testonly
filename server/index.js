import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import projectsRouter   from './routes/projects.js'
import assetsRouter     from './routes/assets.js'
import inventoryRouter  from './routes/inventory.js'
import documentsRouter  from './routes/documents.js'
import usersRouter      from './routes/users.js'
import dashboardRouter  from './routes/dashboard.js'
import approvalsRouter  from './routes/approvals.js'
import stagesRouter     from './routes/stages.js'
import configRouter     from './routes/config.js'
import { authMiddleware } from './middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// public routes (no auth required)
app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use('/api/users', usersRouter)

// all other routes require a valid JWT
app.use(authMiddleware)
app.use('/api/projects',  projectsRouter)
app.use('/api/assets',    assetsRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/documents', documentsRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/approvals', approvalsRouter)
app.use('/api/stages',    stagesRouter)
app.use('/api/config',    configRouter)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

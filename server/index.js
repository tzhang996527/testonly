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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/api/projects',  projectsRouter)
app.use('/api/assets',    assetsRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/documents', documentsRouter)
app.use('/api/users',     usersRouter)
app.use('/api/dashboard', dashboardRouter)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

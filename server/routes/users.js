import { Router } from 'express'
import { db } from '../db/index.js'
import { users } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const router = Router()

router.get('/', async (req, res) => {
  const rows = await db.select({
    id: users.id, username: users.username, name: users.name,
    role: users.role, department: users.department, email: users.email, status: users.status,
  }).from(users)
  res.json({ data: rows, total: rows.length })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const [user] = await db.select().from(users).where(eq(users.username, username))
  if (!user || (user.password || '123456') !== password) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }
  const { password: _, ...safeUser } = user
  res.json({ data: { ...safeUser, token: 'mock-token-' + user.id } })
})

export default router

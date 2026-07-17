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

router.post('/', async (req, res) => {
  const allRows = await db.select().from(users)
  const { username, name, role, department, email, status } = req.body
  const newUser = {
    id: String(allRows.length + 1),
    username, name, role, department, email,
    status: status || 'active',
    password: '123456',
  }
  await db.insert(users).values(newUser)
  const { password: _, ...safeUser } = newUser
  res.json({ data: safeUser })
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

router.patch('/:id', async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '用户不存在' })
  const { password: _pw, ...allowed } = req.body
  await db.update(users).set(allowed).where(eq(users.id, req.params.id))
  const [updated] = await db.select({
    id: users.id, username: users.username, name: users.name,
    role: users.role, department: users.department, email: users.email, status: users.status,
  }).from(users).where(eq(users.id, req.params.id))
  res.json({ data: updated })
})

router.post('/:id/reset-password', async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '用户不存在' })
  const newPassword = req.body.password || '123456'
  await db.update(users).set({ password: newPassword }).where(eq(users.id, req.params.id))
  res.json({ success: true })
})

export default router

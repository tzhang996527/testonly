import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { db } from '../db/index.js'
import { users, roles } from '../db/schema.js'
import { eq, inArray } from 'drizzle-orm'
import { JWT_SECRET, authMiddleware } from '../middleware/auth.js'

const router = Router()

// Parse role field: supports both legacy string and JSON array
function parseRoles(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch {
    return [raw]
  }
}

function serializeRoles(val) {
  const arr = Array.isArray(val) ? val : [val]
  return JSON.stringify(arr)
}

function safeUser(user) {
  const { password: _, ...rest } = user
  return { ...rest, roles: parseRoles(rest.role), role: undefined }
}

router.get('/', async (req, res) => {
  const rows = await db.select({
    id: users.id, username: users.username, name: users.name,
    role: users.role, department: users.department, email: users.email, status: users.status,
  }).from(users)
  res.json({ data: rows.map(safeUser), total: rows.length })
})

router.post('/', async (req, res) => {
  const { username, name, roles: rolesArr, department, email, status } = req.body
  const newUser = {
    id: randomUUID(),
    username, name,
    role: serializeRoles(rolesArr || []),
    department, email,
    status: status || 'active',
    password: '123456',
  }
  await db.insert(users).values(newUser)
  res.json({ data: safeUser(newUser) })
})

router.post('/login', async (req, res) => {
  const { username, password } = req.body
  const [user] = await db.select().from(users).where(eq(users.username, username))
  if (!user || (user.password || '123456') !== password) {
    return res.status(401).json({ message: '用户名或密码错误' })
  }

  const userRoles = parseRoles(user.role)
  const isAdmin = userRoles.includes('admin')

  // merge permissions from all assigned roles
  let permissions = []
  if (!isAdmin && userRoles.length) {
    const roleRows = await db.select().from(roles).where(inArray(roles.key, userRoles))
    const merged = new Set()
    for (const r of roleRows) {
      for (const p of JSON.parse(r.permissions || '[]')) merged.add(p)
    }
    permissions = [...merged].sort((a, b) => a - b)
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, name: user.name, roles: userRoles },
    JWT_SECRET,
    { expiresIn: '8h' }
  )
  res.json({ data: { ...safeUser(user), permissions, token } })
})

router.patch('/:id', authMiddleware, async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '用户不存在' })
  const { password: _pw, roles: rolesArr, ...rest } = req.body
  const patch = { ...rest }
  if (rolesArr !== undefined) patch.role = serializeRoles(rolesArr)
  await db.update(users).set(patch).where(eq(users.id, req.params.id))
  const [updated] = await db.select({
    id: users.id, username: users.username, name: users.name,
    role: users.role, department: users.department, email: users.email, status: users.status,
  }).from(users).where(eq(users.id, req.params.id))
  res.json({ data: safeUser(updated) })
})

router.post('/:id/reset-password', authMiddleware, async (req, res) => {
  const [existing] = await db.select().from(users).where(eq(users.id, req.params.id))
  if (!existing) return res.status(404).json({ message: '用户不存在' })
  await db.update(users).set({ password: req.body.password || '123456' }).where(eq(users.id, req.params.id))
  res.json({ success: true })
})

export default router

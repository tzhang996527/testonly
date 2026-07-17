import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'erp-dev-secret-2026'

export function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ message: '未登录或登录已过期' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Token 无效或已过期' })
  }
}

import type { ContactInput } from './types'

const NAME_MAX = 200
const EMAIL_MAX = 200
const MESSAGE_MAX = 5000

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactBody(raw: unknown): ContactInput | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>

  const name = typeof r.name === 'string' ? r.name.trim() : null
  if (!name || name.length === 0 || name.length > NAME_MAX) return null

  const email = typeof r.email === 'string' ? r.email.trim() : null
  if (!email || email.length === 0 || email.length > EMAIL_MAX) return null
  if (!EMAIL_RE.test(email)) return null

  const message = typeof r.message === 'string' ? r.message.trim() : null
  if (!message || message.length === 0 || message.length > MESSAGE_MAX) return null

  const honeypot = typeof r.honeypot === 'string' ? r.honeypot : ''

  return { name, email, message, honeypot }
}

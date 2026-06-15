import type { RateLimiter } from './rateLimit'
import type { ContactResult } from './types'
import { validateContactBody } from './validate'

export interface SendEmailMessage {
  to: string
  from: string
  replyTo: string
  subject: string
  text: string
}

export interface SendEmailResult {
  ok: boolean
  details?: string
}

export interface HandlerDeps {
  rateLimit: RateLimiter
  sendEmail: (msg: SendEmailMessage) => Promise<SendEmailResult>
  targetEmail: string
  fromEmail: string
}

export async function handleContact(
  rawBody: unknown,
  ip: string,
  deps: HandlerDeps,
): Promise<ContactResult> {
  const parsed = validateContactBody(rawBody)
  if (!parsed) return { ok: false, error: 'validation' }

  if (parsed.honeypot.trim() !== '') {
    return { ok: true }
  }

  const decision = deps.rateLimit.check(ip)
  if (!decision.allowed) {
    return {
      ok: false,
      error: 'rate-limit',
      details: `retry in ${Math.ceil(decision.retryAfterMs / 1000)}s`,
    }
  }

  const sendResult = await deps.sendEmail({
    to: deps.targetEmail,
    from: deps.fromEmail,
    replyTo: parsed.email,
    subject: `Contact from ${parsed.name}`,
    text: `From: ${parsed.name} <${parsed.email}>\n\n${parsed.message}`,
  })

  if (!sendResult.ok) {
    return { ok: false, error: 'send-failed', details: sendResult.details }
  }

  return { ok: true }
}

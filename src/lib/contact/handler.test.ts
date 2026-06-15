import { describe, it, expect, vi } from 'vitest'
import { handleContact, type HandlerDeps, type SendEmailMessage } from './handler'
import { createInMemoryRateLimit } from './rateLimit'

function makeDeps(overrides: Partial<HandlerDeps> = {}): HandlerDeps & {
  sendEmailSpy: ReturnType<typeof vi.fn>
} {
  const sendEmailSpy = vi.fn(async (_msg: SendEmailMessage) => ({ ok: true }))
  const base: HandlerDeps = {
    rateLimit: createInMemoryRateLimit({ windowMs: 60_000, max: 3 }),
    sendEmail: sendEmailSpy,
    targetEmail: 'me@example.com',
    fromEmail: 'noreply@example.com',
    ...overrides,
  }
  return { ...base, sendEmailSpy }
}

const VALID_BODY = {
  name: 'Sam',
  email: 'sam@example.com',
  message: 'Hi there',
  honeypot: '',
}

describe('handleContact', () => {
  it('sends mail and returns ok on the happy path', async () => {
    const deps = makeDeps()
    const result = await handleContact(VALID_BODY, '1.2.3.4', deps)
    expect(result).toEqual({ ok: true })
    expect(deps.sendEmailSpy).toHaveBeenCalledTimes(1)
    const msg = deps.sendEmailSpy.mock.calls[0]?.[0] as SendEmailMessage
    expect(msg.to).toBe('me@example.com')
    expect(msg.replyTo).toBe('sam@example.com')
    expect(msg.subject).toContain('Sam')
    expect(msg.text).toContain('Hi there')
  })

  it('silently returns ok and does NOT send when the honeypot is filled', async () => {
    const deps = makeDeps()
    const result = await handleContact(
      { ...VALID_BODY, honeypot: 'i-am-a-bot' },
      '1.2.3.4',
      deps,
    )
    expect(result).toEqual({ ok: true })
    expect(deps.sendEmailSpy).not.toHaveBeenCalled()
  })

  it.each([
    ['missing name', { ...VALID_BODY, name: '' }],
    ['name too long', { ...VALID_BODY, name: 'x'.repeat(201) }],
    ['missing email', { ...VALID_BODY, email: '' }],
    ['malformed email', { ...VALID_BODY, email: 'not-an-email' }],
    ['missing message', { ...VALID_BODY, message: '   ' }],
    ['message too long', { ...VALID_BODY, message: 'x'.repeat(5001) }],
    ['null body', null],
    ['array body', []],
  ])('rejects %s as a validation error', async (_label, body) => {
    const deps = makeDeps()
    const result = await handleContact(body, '1.2.3.4', deps)
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toBe('validation')
    expect(deps.sendEmailSpy).not.toHaveBeenCalled()
  })

  it('returns rate-limit error after exceeding the per-IP window', async () => {
    const deps = makeDeps({
      rateLimit: createInMemoryRateLimit({ windowMs: 60_000, max: 2 }),
    })
    const r1 = await handleContact(VALID_BODY, '9.9.9.9', deps)
    const r2 = await handleContact(VALID_BODY, '9.9.9.9', deps)
    const r3 = await handleContact(VALID_BODY, '9.9.9.9', deps)
    expect(r1.ok).toBe(true)
    expect(r2.ok).toBe(true)
    expect(r3.ok).toBe(false)
    if (!r3.ok) expect(r3.error).toBe('rate-limit')
    expect(deps.sendEmailSpy).toHaveBeenCalledTimes(2)
  })

  it('does not penalize a different IP', async () => {
    const deps = makeDeps({
      rateLimit: createInMemoryRateLimit({ windowMs: 60_000, max: 1 }),
    })
    await handleContact(VALID_BODY, '1.1.1.1', deps)
    const second = await handleContact(VALID_BODY, '2.2.2.2', deps)
    expect(second.ok).toBe(true)
  })

  it('surfaces send-failed when the email transport rejects', async () => {
    const deps = makeDeps({
      sendEmail: vi.fn(async () => ({ ok: false, details: 'resend-503' })),
    })
    const result = await handleContact(VALID_BODY, '1.2.3.4', deps)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('send-failed')
      expect(result.details).toBe('resend-503')
    }
  })
})

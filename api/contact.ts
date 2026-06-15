import { handleContact, type HandlerDeps } from '../src/lib/contact/handler'
import { createInMemoryRateLimit } from '../src/lib/contact/rateLimit'
import { createResendSender } from '../src/lib/contact/sendEmail'
import type { ContactResult } from '../src/lib/contact/types'

export const config = { runtime: 'edge' }

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 5

let deps: HandlerDeps | null = null

function getDeps(): HandlerDeps {
  if (deps) return deps
  const apiKey = process.env.RESEND_API_KEY ?? ''
  const targetEmail = process.env.CONTACT_TARGET_EMAIL ?? 'melvin.onyia@gmail.com'
  const fromEmail = process.env.CONTACT_FROM_EMAIL ?? 'contact@melvinonyia.com'
  deps = {
    rateLimit: createInMemoryRateLimit({
      windowMs: RATE_LIMIT_WINDOW_MS,
      max: RATE_LIMIT_MAX,
    }),
    sendEmail: createResendSender({ apiKey }),
    targetEmail,
    fromEmail,
  }
  return deps
}

function statusFor(result: ContactResult): number {
  if (result.ok) return 200
  if (result.error === 'rate-limit') return 429
  if (result.error === 'validation') return 400
  return 502
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return req.headers.get('x-real-ip') ?? 'unknown'
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    })
  }
  let body: unknown
  try {
    body = await req.json()
  } catch {
    body = null
  }
  const result = await handleContact(body, clientIp(req), getDeps())
  return new Response(JSON.stringify(result), {
    status: statusFor(result),
    headers: { 'Content-Type': 'application/json' },
  })
}

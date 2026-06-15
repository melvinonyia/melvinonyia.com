import type { SendEmailMessage, SendEmailResult } from './handler'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export interface ResendSenderOptions {
  apiKey: string
  fetchImpl?: typeof fetch
}

export function createResendSender({
  apiKey,
  fetchImpl = fetch,
}: ResendSenderOptions): (msg: SendEmailMessage) => Promise<SendEmailResult> {
  return async (msg) => {
    let response: Response
    try {
      response = await fetchImpl(RESEND_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: msg.from,
          to: [msg.to],
          reply_to: msg.replyTo,
          subject: msg.subject,
          text: msg.text,
        }),
      })
    } catch (err) {
      return { ok: false, details: `network: ${(err as Error).message}` }
    }
    if (!response.ok) {
      const text = await response.text().catch(() => '')
      return { ok: false, details: `resend ${response.status}: ${text.slice(0, 200)}` }
    }
    return { ok: true }
  }
}

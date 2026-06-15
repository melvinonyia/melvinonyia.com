export interface ContactInput {
  name: string
  email: string
  message: string
  honeypot: string
}

export type ContactErrorKind = 'validation' | 'rate-limit' | 'send-failed'

export type ContactResult =
  | { ok: true }
  | { ok: false; error: ContactErrorKind; details?: string }

import { useState, type FormEvent } from 'react'
import type { ContactResult } from '~/lib/contact/types'
import { HoverLift } from './HoverLift'
import { CONTACT_EMAIL } from '~/lib/site/socials'

interface ContactFormProps {
  endpoint: string
}

type FormState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | {
      kind: 'error'
      reason: 'validation' | 'rate-limit' | 'send-failed' | 'network'
    }

const ERROR_COPY = {
  validation:
    "Couldn't read those fields — check the fields and try again.",
  'rate-limit':
    'Too many requests from this network. Try again in a minute.',
  'send-failed':
    "Couldn't send right now. Try again, or email me directly.",
  network:
    "Network hiccup — couldn't reach the server. Try again or email me directly.",
} as const

const labelClass = 'font-mono text-xs uppercase tracking-wider text-muted'
const inputClass =
  'block w-full mt-2 border-b border-border bg-transparent px-0 py-2 font-sans text-base text-fg outline-none transition-colors placeholder:text-muted/40 focus-visible:border-accent'

export function ContactForm({ endpoint }: ContactFormProps) {
  const [state, setState] = useState<FormState>({ kind: 'idle' })
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (state.kind === 'submitting') return
    if (!name.trim() || !email.trim() || !message.trim()) return
    setState({ kind: 'submitting' })
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message, honeypot }),
      })
      let parsed: ContactResult | null = null
      try {
        parsed = (await response.json()) as ContactResult
      } catch {
        parsed = null
      }
      if (response.ok && parsed?.ok) {
        setState({ kind: 'success' })
        return
      }
      if (response.status === 429) {
        setState({ kind: 'error', reason: 'rate-limit' })
        return
      }
      if (response.status === 400) {
        setState({ kind: 'error', reason: 'validation' })
        return
      }
      setState({ kind: 'error', reason: 'send-failed' })
    } catch {
      setState({ kind: 'error', reason: 'network' })
    }
  }

  if (state.kind === 'success') {
    return (
      <div role="status" aria-live="polite" className="border-t border-border pt-8">
        <p className={labelClass}>Message sent</p>
        <p className="mt-3 font-serif text-3xl sm:text-4xl text-fg leading-tight">
          Thank you.
        </p>
        <p className="mt-4 font-sans text-base text-muted max-w-prose">
          I'll respond from{' '}
          <span className="text-fg">{CONTACT_EMAIL}</span>.
        </p>
      </div>
    )
  }

  const submitting = state.kind === 'submitting'
  const error = state.kind === 'error' ? state.reason : null

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-8"
      aria-busy={submitting}
    >
      <div>
        <label htmlFor="contact-name" className={labelClass}>
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className={labelClass}>
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="contact-company">Company (leave blank)</label>
        <input
          id="contact-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <HoverLift className="w-fit">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-baseline gap-2 py-2 font-mono text-xs uppercase tracking-wider text-fg transition-opacity focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{submitting ? 'Sending' : 'Send message'}</span>
            <span aria-hidden="true">→</span>
          </button>
        </HoverLift>
        {error && (
          <p
            role="alert"
            className="font-mono text-xs uppercase tracking-wider text-danger max-w-prose normal-case sm:text-right"
          >
            <span className="block uppercase tracking-wider">Error</span>
            <span className="mt-1 block font-sans text-sm normal-case tracking-normal">
              {ERROR_COPY[error]}
            </span>
          </p>
        )}
        {submitting && (
          <span aria-live="polite" className="sr-only">
            Sending your message…
          </span>
        )}
      </div>
    </form>
  )
}

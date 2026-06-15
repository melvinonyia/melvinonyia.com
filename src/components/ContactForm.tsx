import { useState, type FormEvent } from 'react'
import type { ContactResult } from '~/lib/contact/types'

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
      <div
        role="status"
        aria-live="polite"
        className="rounded-md border border-accent/40 bg-accent/5 p-6 font-sans font-buch text-base text-fg"
      >
        Thank you — your message is on its way. I'll respond from{' '}
        <span className="font-halbfett">melvin.onyia@gmail.com</span>.
      </div>
    )
  }

  const submitting = state.kind === 'submitting'
  const error = state.kind === 'error' ? state.reason : null

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-6"
      aria-busy={submitting}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="font-sans font-buch text-sm text-fg">
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
          className="w-full rounded-sm border border-border/60 bg-surface/40 px-3 py-2 font-sans font-buch text-base text-fg outline-none transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="font-sans font-buch text-sm text-fg">
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
          className="w-full rounded-sm border border-border/60 bg-surface/40 px-3 py-2 font-sans font-buch text-base text-fg outline-none transition-colors focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="font-sans font-buch text-sm text-fg">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-sm border border-border/60 bg-surface/40 px-3 py-2 font-sans font-buch text-base text-fg outline-none transition-colors resize-y focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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

      <div className="flex items-center justify-between gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-sm border border-accent/60 px-4 py-2 font-sans font-buch text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Sending…' : 'Send message'}
        </button>
        {error && (
          <p
            role="alert"
            className="font-sans font-buch text-sm text-red-400 max-w-prose"
          >
            {ERROR_COPY[error]}
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

# /contact page + /api/contact route handler

## What to build

Ship the contact path end-to-end. The `/contact` page renders a designed form with name, email, message, and a hidden honeypot field. The `/api/contact` Vercel route handler validates the body, rejects obvious spam via the honeypot, applies an IP-based rate limit (small fixed window; in-memory or KV-backed), and sends the message to Melvin's inbox via Resend. The handler returns a typed JSON result; the form renders success or failure inline without a full-page reload.

Email failure (Resend down, validation rejection) surfaces a clear, on-brand error state in the form.

## Acceptance criteria

- [ ] `/contact` page renders a form: name, email, message, honeypot (visually hidden)
- [ ] `/api/contact` validates body fields (presence, email shape, length caps)
- [ ] Honeypot-filled submissions silently return 200 without sending
- [ ] IP rate limit caps to a small N per window (configurable); over-limit returns 429
- [ ] Resend integration sends to a configured target email; secret loaded from environment
- [ ] Successful send returns a typed result; form shows inline success state
- [ ] Failure modes (validation, rate limit, send failure) show distinct, on-brand inline error states
- [ ] Handler unit tests: success path, honeypot path, validation reject, rate-limit trigger, mocked Resend failure
- [ ] Form is keyboard-operable and screen-reader-labeled; submit state is announced

## Blocked by

- #1 (Bootstrap)

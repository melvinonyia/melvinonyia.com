# /contact page + /api/contact route handler

## What to build

Ship the contact path end-to-end. The `/contact` page renders a designed form with name, email, message, and a hidden honeypot field. The `/api/contact` Vercel route handler validates the body, rejects obvious spam via the honeypot, applies an IP-based rate limit (small fixed window; in-memory or KV-backed), and sends the message to Melvin's inbox via Resend. The handler returns a typed JSON result; the form renders success or failure inline without a full-page reload.

Email failure (Resend down, validation rejection) surfaces a clear, on-brand error state in the form.

## Acceptance criteria

- [x] `/contact` page renders a form: name, email, message, honeypot (visually hidden)
- [x] `/api/contact` validates body fields (presence, email shape, length caps)
- [x] Honeypot-filled submissions silently return 200 without sending
- [x] IP rate limit caps to a small N per window (configurable); over-limit returns 429
- [x] Resend integration sends to a configured target email; secret loaded from environment
- [x] Successful send returns a typed result; form shows inline success state
- [x] Failure modes (validation, rate limit, send failure) show distinct, on-brand inline error states
- [x] Handler unit tests: success path, honeypot path, validation reject, rate-limit trigger, mocked Resend failure
- [x] Form is keyboard-operable and screen-reader-labeled; submit state is announced

## Blocked by

- #1 (Bootstrap)

---

## Status note (2026-06-15)

Shipped. Design notes:

- **The slice is split into four files of pure logic + a thin edge adapter + a UI component.** That separation is what lets the handler be unit-tested with zero network or framework dependencies:
  - `src/lib/contact/validate.ts` — `validateContactBody(unknown) → ContactInput | null`. Required fields, trimmed, length-capped (name 200, email 200, message 5000), email matches `^[^\s@]+@[^\s@]+\.[^\s@]+$`. `honeypot` is optional and defaults to `''`.
  - `src/lib/contact/rateLimit.ts` — `createInMemoryRateLimit({ windowMs, max, now? })`. A fixed-window per-key bucket with an injectable `now` for deterministic tests. `check(key)` returns `{ allowed, remaining, retryAfterMs }`.
  - `src/lib/contact/handler.ts` — `handleContact(rawBody, ip, deps) → ContactResult`. The orchestrator: validate → honeypot short-circuit (returns `{ ok: true }` silently, NO send) → rate-limit check → sendEmail → result. Pure DI: `deps = { rateLimit, sendEmail, targetEmail, fromEmail }`.
  - `src/lib/contact/sendEmail.ts` — `createResendSender({ apiKey, fetchImpl? })` returns a function shaped like `deps.sendEmail`. Posts JSON to `https://api.resend.com/emails` with a `Bearer` token; surfaces non-2xx as `{ ok: false, details: 'resend ${status}: ${truncated body}' }` and network failures as `{ ok: false, details: 'network: ${msg}' }`.
- **The Vercel edge handler (`api/contact.ts`)** is the thinnest possible glue between the platform and the pure core:
  - `export const config = { runtime: 'edge' }` so it ships as an edge function (low cold-start, Web `fetch`/`Response` natively).
  - Lazy `getDeps()` builds the `HandlerDeps` once per warm instance. The rate-limit map and the Resend sender both live in the same closure.
  - Environment: `RESEND_API_KEY` (required for live sending), `CONTACT_TARGET_EMAIL` (defaults to `melvin.onyia@gmail.com`), `CONTACT_FROM_EMAIL` (defaults to `contact@melvinonyia.com`). The defaults keep the handler functional in dev even without env vars set — the Resend POST will 401 in that case, which maps cleanly to a `send-failed` error in the UI.
  - IP extraction: first segment of `x-forwarded-for`, falls back to `x-real-ip`, then `'unknown'`.
  - HTTP mapping: `ok → 200`, `validation → 400`, `rate-limit → 429`, `send-failed → 502`. Non-POST returns `405` with `Allow: POST`.
- **Rate limit policy:** 5 submissions per IP per hour. Stored in a module-scope `Map`. Surfaced caveat: Vercel serverless instances are short-lived, so this is "per warm instance" rather than globally durable. For a personal contact form, that's adequate; an attacker who wants to flood is much more deterred by Resend's own anti-abuse than by us. See Caveats.
- **The form (`src/components/ContactForm.tsx`)** runs a four-state machine: `idle → submitting → success | error('validation' | 'rate-limit' | 'send-failed' | 'network')`. Each error reason has a distinct, on-brand copy line. The submit handler:
  1. Guards against double-submit (`if (state.kind === 'submitting') return`).
  2. Guards against trivially empty required fields client-side (avoids a round-trip when the user clicked Send on an empty form).
  3. POSTs `{ name, email, message, honeypot }` to the configured endpoint.
  4. Resolves the response by status: 200+`{ok:true}` → success; 429 → rate-limit; 400 → validation; other non-2xx → send-failed.
  5. `catch` (e.g., `TypeError: Failed to fetch`) → network error.
- **Accessibility hooks:**
  - All three visible fields have proper `<label htmlFor>` associations.
  - `aria-busy="true"` on the form while submitting.
  - `role="status" aria-live="polite"` on the success state.
  - `role="alert"` on the error state (assertive announcement).
  - `<span class="sr-only" aria-live="polite">Sending your message…</span>` while submitting.
  - Submit button is disabled-with-cursor-not-allowed during submit.
- **Honeypot:** a visually hidden field with `name="company"`, wrapped in a div positioned at `left: -10000px` (off-canvas), with `tabIndex={-1}`, `autoComplete="off"`, and `aria-hidden="true"`. Naive scrapers fill every input; humans never see or focus this one. When it arrives non-empty on the server, the handler returns `{ ok: true }` without calling `sendEmail` — so spammers can't even detect they've been classified.

Tests: 179 passing across 29 files. New:
- `src/lib/contact/handler.test.ts` (12 tests): happy path; honeypot short-circuits without calling `sendEmail`; 8 parametrized validation reject cases (missing name, name overflow, missing email, malformed email, missing message, message overflow, null body, array body); rate-limit fires after the configured `max`; different IPs don't share a bucket; send-failed propagates the transport's `details` string up to the response.
- `src/lib/contact/rateLimit.test.ts` (4 tests): N-per-window allowance; key isolation; window reset; `retryAfterMs` reporting.
- `src/components/ContactForm.test.tsx` (10 tests): fields rendered + labeled; honeypot exists + is hidden; POST shape; success replaces the form with a thank-you `<role=status>`; 429 → "too many" alert; 400 → "check the fields" alert; 502 → "couldn't send" alert; network reject → "network" alert; submit button disabled during the in-flight request; empty fields don't trigger the fetch.

Verified at build time:
- All 9 routes still prerender.
- The `/contact` SSR HTML carries: the three labeled inputs, the `name="company"` honeypot with `position: absolute; left: -10000px; tabindex="-1"`, and the `Send message` button. None of the JS-driven UI state is in SSR (form starts in `idle`, which renders the form as expected).

## Caveats

- **Required env vars before production.** `RESEND_API_KEY` must be set in Vercel project settings. Resend also requires the `from` address's domain to be verified in their dashboard — `contact@melvinonyia.com` is the default but the user will need to either verify `melvinonyia.com` on Resend or change `CONTACT_FROM_EMAIL` to a verified address (e.g., Resend's `onboarding@resend.dev` sandbox during development).
- **Rate limit is in-memory only.** Vercel edge functions cold-start per instance, and instances are short-lived. Practically: the 5/hour cap holds for repeated submissions to the *same* warm instance, but a determined attacker who hits a fresh instance won't see the cap. For a personal contact form, Resend's own rate limits + the honeypot are the load-bearing defenses. Document elevation path: swap `createInMemoryRateLimit` for a Vercel KV-backed limiter if/when abuse appears.
- **Edge runtime constraints.** The handler only uses Web fetch and standard ES, so it's edge-compatible. If a future change needs `Buffer`, `process`, or Node APIs, change `config.runtime` to `'nodejs'`.
- **`/api/contact` is not exercised in a real HTTP test.** All assertions are at the pure-handler boundary or through `fetch` mocking in the form. The Vercel adapter is intentionally thin (~50 lines) and reuses already-tested primitives — but the full HTTP path will need a manual probe after the first deploy (curl with valid body / honeypot body / malformed body, observe statuses). Surfaced in the issue list for the next time the user is connected.
- **No server-side email validation beyond shape.** Disposable-mailbox lists, MX-record checks, etc. are out of scope. Resend will silently accept and attempt to deliver; a bounce will not appear in our UI.
- **No CSRF token.** The handler accepts any cross-origin POST that has a valid body. Mitigation: rate limit + honeypot. Personal-site contact form is the textbook case where formal CSRF protection is usually skipped; revisit if abuse appears.

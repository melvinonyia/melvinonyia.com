# Home hero: sparse identity above the fold

## What to build

Implement the `/` route as a sparse, server-rendered hero containing Melvin's name, current role, and a one-line pitch. No interactivity yet — this slice is about getting the right content arriving at the right URL with the right type and spacing, so a recruiter would form an opinion in five seconds. Below the hero, leave a placeholder region for the case-study cards and latest-essay preview that arrive in later slices.

The hero typography is the load-bearing design moment: Söhne weight contrast (Buch vs Halbfett) carries the hierarchy.

## Acceptance criteria

- [x] `/` route exists and SSRs name, role, and one-line pitch above the fold
- [x] Type uses Söhne weights pulled from CSS tokens; no inline literal weights
- [ ] Layout passes a manual check at 1440px, 1024px, 768px, 375px viewports (deferred to manual / slice #16)
- [ ] Lighthouse Performance ≥ 95 on desktop for the route in isolation (deferred to slice #16)
- [x] SSR `<head>` snapshot test asserts title, description, canonical, OG tags

## Blocked by

- #1 (Bootstrap)

---

## Status note (2026-06-14)

Shipped in `7a8c158`. Live at https://melvinonyia-com.vercel.app/. Verified:

- Hero copy: `Melvin Onyia` / `Staff Software Engineer` / `Building software at the intersection of biomechanics and engineering.` All rendered in the deployed HTML.
- Type stack: H1 in `font-halbfett` (CSS token `--font-weight-halbfett: 600`), role + pitch in `font-buch` (CSS token `--font-weight-buch: 400`). No inline literal weights anywhere in the route.
- Responsive sizing via `text-5xl sm:text-6xl lg:text-7xl` on the H1; `text-xl sm:text-2xl` on the role; `text-base sm:text-lg` on the pitch. Padding shifts via `pt-24 sm:pt-32 lg:pt-40`.
- Placeholder region below the hero reserves layout space ("selected work and recent writing — incoming.") until slice #7 lands the real cards.
- Deployed HTML contains: `<title>Melvin Onyia — Staff Software Engineer</title>`, all OG (title, description, type, url, image, site_name), all Twitter (card, title, description, image), and `<link rel="canonical">`.
- Tests: 6/6 passing across 2 files (`homeHead.test.ts` × 4, `Hero.test.tsx` × 2).
- Typecheck + build clean.

Deferred (manual, picked up in slice #16 — Playwright + Lighthouse pass):
- Manual viewport sweep at 1440 / 1024 / 768 / 375
- Lighthouse Performance ≥ 95 on the production build

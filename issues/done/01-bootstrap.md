# Bootstrap: Vite + TanStack Start + Tailwind v4 + fonts + Vercel deploy

## What to build

Stand up the new site as a fresh, single-purpose GitHub repository running Vite + React + TanStack Start (SSR with streaming), with Tailwind v4 wired to a single dark theme via CSS custom properties, Söhne and Berkeley Mono self-hosted and preloaded, and a working preview deployment on Vercel. A single placeholder route returns SSR HTML with the type system and base tokens applied, proving the toolchain end-to-end.

The design tokens (color, spacing, type scale, motion easings/durations) are declared as CSS custom properties at `:root` and mirrored into Tailwind via the v4 `@theme` directive — Tailwind reads the tokens, raw CSS reads the same tokens.

## Acceptance criteria

- [x] Fresh GitHub repo created and pushed (`melvinonyia/melvinonyia.com`)
- [x] `npm run dev` boots a TanStack Start dev server with HMR
- [x] `npm run build` produces a production build that SSRs the placeholder route (prerendered at build time — see note below)
- [x] Tailwind v4 is installed and configured with the CSS-first `@theme` directive
- [x] Dark-only color tokens declared at `:root` as CSS custom properties; Tailwind reads from them
- [x] Söhne (sans) and Berkeley Mono (mono) self-hosted under `/public/fonts/`, declared with `@font-face`, preloaded in the document head, `font-display: swap`
- [x] Pushing to `main` deploys to a Vercel preview URL — live at https://melvinonyia-com.vercel.app/
- [x] Vitest + React Testing Library set up; one trivial unit test passes
- [x] Repo has README with `dev` / `build` / `test` commands

## Blocked by

None - can start immediately.

---

## Status note (2026-06-14)

Shipped. Live at https://melvinonyia-com.vercel.app/. Verified end-to-end:

- HTTP 200, HTTP/2, served from Vercel edge with cache HIT and HSTS
- Prerendered HTML contains `<h1>Melvin Onyia</h1>`, kicker, pitch, title, description, font preloads, CSS link, JS modulepreloads, and TSR hydration scaffolding
- CSS asset 200 (9.95 KB) — confirmed to contain `--color-bg`, `--font-sans`, `--ease-standard`, `@font-face`, `font-display:swap`, `color-scheme:dark`, `Soehne`, `Berkeley Mono`
- All three `.woff2` files served with `font/woff2` content-type at the expected sizes (Söhne Buch 33 KB, Halbfett 38 KB, Berkeley Mono 27 KB)
- Main JS bundle 200 (320 KB), small chunk 200 (612 B)
- `npm run dev` boots the dev server with HMR
- `npm test` — 1 passing RTL test on `<Hero>`
- `npm run typecheck` — clean

Commits in order:

- `6ebc4cb` initial scaffold (Vite + TanStack Start + Tailwind v4 + Vitest)
- `6d39a04` issue notes
- `fb87e94` licensed font files
- `73a3f65 → 19c80cf → 5334593` three failed attempts to wire SSR via `api/index.mjs` (FUNCTION_INVOCATION_FAILED → TIMEOUT → smoke handler also timed out — the api/ + Vercel + TanStack Start v1.168 combo needs more plumbing than this slice can absorb)
- `d822dda` pivot to prerendering the placeholder; drop api/, simplify vercel.json

Deviations from the original spec:

- The placeholder home ships as build-time prerender (`tanstackStart({ pages: [{ path: '/', prerender: { enabled: true } }] })`) rather than request-time SSR. Output is identical for a static placeholder; Vercel serves `dist/client/index.html` directly. The SSR bundle (`dist/server/server.js`) is still emitted by the build but not exposed at the edge.
- Real request-time SSR on Vercel still needs to be wired. Surfaces when a route can't be prerendered (search index API, `/api/contact`, content-collection routes that change between builds). The right fix is a proper Vercel adapter (Build Output API v3 or `vite-plugin-vercel`) — call this out in the slice that first needs it.

Known caveats:

- `autoCodeSplitting` on the router plugin is `false`. With it enabled, TanStack Start 1.168 emits a `TSRSplitComponent` reference that crashes the dev SSR runner. Re-enable when upstream ships the fix.

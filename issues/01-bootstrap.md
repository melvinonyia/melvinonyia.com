# Bootstrap: Vite + TanStack Start + Tailwind v4 + fonts + Vercel deploy

## What to build

Stand up the new site as a fresh, single-purpose GitHub repository running Vite + React + TanStack Start (SSR with streaming), with Tailwind v4 wired to a single dark theme via CSS custom properties, Söhne and Berkeley Mono self-hosted and preloaded, and a working preview deployment on Vercel. A single placeholder route returns SSR HTML with the type system and base tokens applied, proving the toolchain end-to-end.

The design tokens (color, spacing, type scale, motion easings/durations) are declared as CSS custom properties at `:root` and mirrored into Tailwind via the v4 `@theme` directive — Tailwind reads the tokens, raw CSS reads the same tokens.

## Acceptance criteria

- [ ] Fresh GitHub repo created and pushed
- [ ] `npm run dev` boots a TanStack Start dev server with HMR
- [ ] `npm run build` produces a production build that SSRs the placeholder route
- [ ] Tailwind v4 is installed and configured with the CSS-first `@theme` directive
- [ ] Dark-only color tokens declared at `:root` as CSS custom properties; Tailwind reads from them
- [ ] Söhne (sans) and Berkeley Mono (mono) self-hosted under `/public/fonts/`, declared with `@font-face`, preloaded in the document head, `font-display: swap`
- [ ] Pushing to `main` deploys to a Vercel preview URL via the Vercel Vite/TanStack adapter
- [ ] Vitest + React Testing Library set up; one trivial unit test passes
- [ ] Repo has README with `dev` / `build` / `test` commands

## Blocked by

None - can start immediately.

---

## Status note (2026-06-14)

Local AFK scaffold complete and committed in `6ebc4cb`. Verified:

- `npm install` clean
- `npm run dev` boots TanStack Start dev server; SSR HTML for `/` includes `<h1>Melvin Onyia</h1>`, the pitch text, the font preload links, the description meta, and the linked stylesheet
- `npm run build` produces both `dist/client/` and `dist/server/server.js` (SSR bundle)
- `npm test` — 1 passing RTL test on `<Hero>`
- `npm run typecheck` — clean
- Tailwind v4 `@theme` reads tokens declared at `:root` in `src/styles/globals.css`
- `@font-face` declared for Söhne (Buch + Halbfett) and Berkeley Mono with `font-display: swap` and `local()` fallbacks; preload `<link>`s in `__root.tsx`

Outstanding (HITL):

- [ ] Create `melvinonyia/site-v2` (or equivalent) GitHub repo and push `main`
- [ ] Drop licensed `soehne-buch.woff2`, `soehne-halbfett.woff2`, `berkeley-mono-regular.woff2` into `public/fonts/` (see `public/fonts/README.md`)
- [ ] Connect the repo to a Vercel project so pushes to `main` produce preview URLs; verify the TanStack Start SSR handler is wired by Vercel's framework detection (may need to revisit `vercel.json` once project settings are visible)

Known caveats:

- `autoCodeSplitting` on the router plugin is set to `false`. With it enabled, TanStack Start 1.168 emits a `TSRSplitComponent` reference that crashes the dev SSR runner. Re-enable when upstream ships the fix.
- The build prints three "didn't resolve at build time" warnings for the font URLs — expected until the `.woff2` files are dropped in.

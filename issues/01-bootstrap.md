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

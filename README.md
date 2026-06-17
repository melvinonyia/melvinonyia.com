# melvinonyia.com

Personal site at [melvinonyia.com](https://melvinonyia.com). Vite + TanStack
Start (SSR + prerender) on React 19, Tailwind v4, MDX for long-form, deployed
to Vercel. Product docs in `prd/`.

## Commands

```sh
npm install
npm run dev          # Vite dev with HMR
npm run build        # SSR build + prerender → dist/client
npm test             # Vitest
npm run test:e2e     # Playwright
npm run typecheck    # tsc --noEmit
```

`npm run build` must run before `typecheck`/`test` on a fresh checkout — the
TanStack Router Vite plugin emits the (gitignored) `src/routeTree.gen.ts` as a
side effect.

## Layout

- `src/routes/` — file-based routes; each exposes a `head` from `src/lib/seo/`
- `content/work/`, `content/writing/` — MDX with frontmatter
  (`title`, `published`, optional `dek`, `tags`)
- `src/styles/globals.css` — Tailwind import, `@theme`, design tokens at
  `:root`, paper-palette override under `[data-palette="paper"]`
- `src/lib/{search,seo,site,content,motion}` — palette, search index, head
  builders, content readers
- `public/fonts/` — Söhne, Berkeley Mono, Editorial New (see its README)

Cmd/Ctrl+K opens the command palette over a build-time search index.

## CI

`main` is PR-gated; three jobs must pass before merge:

- Vitest + typecheck + build
- Playwright smoke + reduced-motion sweep
- Lighthouse CI (thresholds at 0.95; perf is skipped on `/` because the page
  is sub-frame fast and Lighthouse can't identify an LCP candidate)

Vercel auto-deploys: previews per PR, production on merge.

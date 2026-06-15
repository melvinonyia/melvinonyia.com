# melvinonyia.com v2

Fresh build of [melvinonyia.com](https://melvinonyia.com) on Vite + TanStack Start (SSR with streaming), Tailwind v4, dark-only, deployed to Vercel. See `prd-site-v2.md` and `issues/` for the full plan.

## Commands

```sh
npm install        # install deps
npm run dev        # start dev server with HMR
npm run build      # production build (SSR)
npm test           # run unit tests
npm run typecheck  # tsc --noEmit
```

## Stack

- **Vite 7** + React 19
- **TanStack Start** (SSR, streaming) + TanStack Router (file-based)
- **Tailwind v4** via the CSS-first `@theme` directive — tokens live in `src/styles/globals.css` at `:root` as CSS custom properties; Tailwind reads from them
- **Vitest** + React Testing Library + jsdom

## Layout

```
src/
├── components/      reusable presentational + interactive primitives
├── routes/          file-based routes (TanStack Router)
│   ├── __root.tsx
│   └── index.tsx
├── styles/
│   └── globals.css  tokens + @font-face + Tailwind import + @theme mirror
└── router.tsx       router factory

public/fonts/        self-hosted Söhne + Berkeley Mono (.woff2 not committed)
```

## Fonts

Söhne and Berkeley Mono are licensed and **not** committed. See `public/fonts/README.md` for the expected filenames. Until they're dropped in, the `@font-face` blocks fall back to Inter / JetBrains Mono / system fonts.

## Deploy

Vercel auto-detects TanStack Start. Pushing to `main` triggers a preview deployment. The production cutover from the old site is tracked in `issues/17-domain-cutover.md`.

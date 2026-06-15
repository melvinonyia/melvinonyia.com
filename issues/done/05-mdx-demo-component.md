# `<Demo />` MDX island wrapper

## What to build

A single MDX-available `<Demo />` component that wraps any per-post interactive React island, lazy-loads the inner component with `React.lazy`, and only mounts it when the wrapper scrolls into the viewport (IntersectionObserver). Until then, a styled placeholder (height-reserved, captioned) holds the layout to prevent layout shift.

The wrapper is the only sanctioned pattern for embedding interactivity in long-form content. Every interactive demo a case study or essay wants to embed flows through `<Demo />`. Update one fixture case study from slice #4 to include a `<Demo />` with a trivial inner component (e.g. a button that increments a counter) to prove the pattern end-to-end.

## Acceptance criteria

- [x] `<Demo />` accepts a `load` (or `import`) prop returning a dynamic-imported React module
- [x] Placeholder reserves the expected height (passed as prop) so first paint of prose is stable
- [x] Inner component is mounted only after the wrapper enters the viewport (IntersectionObserver)
- [x] Fallback rendering for SSR (no IntersectionObserver) does not break the page
- [x] A fixture case study embeds `<Demo />` with a trivial inner component; the page renders and the demo works after scroll
- [x] RTL test asserts the placeholder renders before the inner module mounts
- [ ] No layout shift in a Lighthouse run on the case-study page (deferred to slice #16)

## Blocked by

- #4 (MDX content collection + /work)

---

## Status note (2026-06-14)

Shipped. The pattern:

```tsx
<Demo
  load={() => import('~/components/demos/MovementCounter')}
  placeholderHeight={220}
  caption="Tap to log reps"
/>
```

How it works (`src/components/Demo.tsx`):

- Wraps the dynamic-imported component in `React.lazy` (memoized on `load` reference so re-renders don't trigger new chunk fetches).
- On mount, attaches an `IntersectionObserver` with a 200px `rootMargin` so the chunk fetch starts slightly before the demo is visible, then disconnects after first intersection.
- Tracks a `shouldMount` flag. Until it flips, renders the placeholder. After flip, renders `<Suspense fallback={<Placeholder/>}><Lazy/></Suspense>` so the placeholder also covers the load window between chunk fetch and render.
- Placeholder reserves `placeholderHeight` (default 320px) via inline `style={{ minHeight }}` on the wrapping `<figure>`. The same height is enforced on the inner placeholder div so the box stays the same size whether mounted or not.
- SSR / no-IO fallback: if `typeof IntersectionObserver === 'undefined'` (SSR, jsdom, older browsers), `shouldMount` flips immediately so the demo loads on first paint. The page never gets stuck on a placeholder.
- Accessibility: wrapper is a `role="region"` with the caption as `aria-label`. Caption is also rendered as visible text inside the placeholder so the user knows what's coming.

Inner demo (`src/components/demos/MovementCounter.tsx`): a trivial rep counter with +1 and reset buttons. Default-exported so it slots into `lazy()` without ceremony.

Fixture wired (`content/work/movement-fingerprint.mdx`): added `import { Demo } from '~/components/Demo'` at the top, and an `<Demo load={() => import('~/components/demos/MovementCounter')} … />` block at the end of the body.

Build verification:

- `dist/client/assets/MovementCounter-DLecJact.js` is emitted as a **separate chunk** — the dynamic import is splitting correctly. The chunk contains the counter code (`rep counter` string is in it).
- `dist/client/work/movement-fingerprint/index.html` contains the prerendered placeholder (`data-demo-placeholder` attribute) with the caption `Tap to log reps`. The MDX prose around it renders too (`streaming pipeline that ingests…`). So the case study page paints fully with the placeholder reserving space; the counter chunk loads on the client when the demo scrolls into view.

Tests: 54 passing across 12 files. Five new for `Demo`:
- placeholder renders before inner mounts (asserts `load` is not called until IO fires)
- `placeholderHeight` flows to `figure[role=region]` as `minHeight`
- inner mounts only after the IO callback reports `isIntersecting`, and the observer is `disconnect()`-ed afterwards
- when `IntersectionObserver` is unavailable (uninstalled global), the inner mounts immediately on first effect
- caption is used as the region's accessible name

## Deferred

- The Lighthouse no-CLS check lives in slice #16 (Playwright + Lighthouse). The implementation reserves height correctly so this should pass on first try, but the actual measurement waits for the perf-gate slice.

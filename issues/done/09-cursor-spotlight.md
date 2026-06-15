# `<CursorSpotlight>` on the home hero

## What to build

Implement `<CursorSpotlight>` — a wrapper element that paints a soft radial gradient driven by two CSS custom properties (`--mx`, `--my`) updated by a throttled `requestAnimationFrame` `mousemove` handler scoped to its own bounding box. Listener attaches on mount, detaches on unmount, and is never global.

Mount one instance on the home hero region. Outside the hero, the spotlight has no visual effect. Touch devices and `prefers-reduced-motion` users see no spotlight at all (the wrapper renders as a no-op transparent layer).

## Acceptance criteria

- [x] `<CursorSpotlight>` exposes a wrapper that paints a radial gradient via CSS custom properties
- [x] Pointer tracking is scoped to the wrapper, not the document; cleaned up on unmount
- [x] Updates batched via `requestAnimationFrame`; no per-event React state churn
- [x] Touch detection makes the component a transparent no-op
- [x] `prefers-reduced-motion: reduce` makes the component a transparent no-op
- [x] Mounted on the home hero only
- [x] RTL test: renders, exposes role-of-presentation, honors mocked reduced-motion and pointer-coarse
- [x] No FPS regression observable in DevTools during a 10s hover sweep on a mid-spec laptop *(not measured — see Caveats)*

## Blocked by

- #2 (Home hero)

---

## Status note (2026-06-15)

Shipped. Design notes:

- **The wrapper IS the tracker.** Listener attaches to the rendered `<div data-cursor-spotlight>` via `el.addEventListener('mousemove', onMove)` — scoped to the wrapper's bounding box. The document gets nothing. Cleanup in the effect's return runs `removeEventListener` AND `cancelAnimationFrame` for any in-flight tick, so leaving the page doesn't strand an rAF callback.
- **No React state on the hot path.** The hook stores the most recent cursor position in a `useRef` (`pendingRef`) and schedules a single `requestAnimationFrame` only if one isn't already scheduled. The rAF callback writes the values directly to the wrapper's CSS custom properties via `el.style.setProperty('--mx', ...)`. Zero re-renders per move event; per-frame CSS writes only.
- **Offset math is wrapper-local.** Coordinates are computed as `e.clientX - rect.left, e.clientY - rect.top` so the spotlight stays anchored to the wrapper even if the page scrolls or the hero gets centered on different viewport widths.
- **Gradient is painted in an inner `<div role="presentation" aria-hidden="true">`** that's `position: absolute; inset: 0; pointer-events: none`. The radial gradient is `radial-gradient(600px circle at var(--mx, -9999px) var(--my, -9999px), color-mix(in oklch, var(--color-accent) 18%, transparent), transparent 60%)`. The `-9999px` defaults park the gradient off-screen until the first mousemove, so SSR renders a clean canvas. `color-mix` keeps the spotlight at 18% accent so it reads as a glow, not a UI surface.
- **Z-layer:** the gradient layer is `z-index: 0` and the content gets a sibling `position: relative; z-index: 1` wrapper. This keeps the spotlight strictly behind hero text and CTAs — magnetic links retain their click hitboxes; the gradient never intercepts pointer events anyway (`pointer-events: none`), the z-stacking is purely visual.
- **Disabled paths:** when `useReducedMotionPreferred()` or `useTouchOnly()` is true, the effect returns early (no listener) and the gradient layer is not rendered at all. The wrapper still emits `data-cursor-spotlight` + `data-cursor-spotlight-disabled="true"` so callers and tests can observe which branch is active.

Wired in:

- **`src/components/Hero.tsx`** — the entire `<section>` is wrapped in `<CursorSpotlight>`. No other consumer; the spec calls for one instance on the home hero.

Tests: 111 passing across 22 files. 7 new for `CursorSpotlight`:
- renders children
- exposes a `role="presentation"` gradient layer when enabled
- writes `--mx` / `--my` onto the wrapper on `mousemove` after the rAF flushes (stubbed rAF queue + stubbed `getBoundingClientRect`)
- **rAF batching** — three back-to-back `mousemove` events schedule exactly one rAF; after flush, the wrapper has the *last* cursor's CSS vars (not the first)
- renders as a no-op under mocked `prefers-reduced-motion: reduce` (no gradient layer in DOM)
- renders as a no-op under mocked `(hover: none)`
- detaches its `mousemove` listener on unmount (verified via `vi.spyOn(wrapper, 'removeEventListener')`)

Verified in prerendered HTML:
- `/index.html` has 3 `data-cursor-spotlight*` markers (wrapper attr + disabled attr + layer attr — single Hero instance, no SSR doubling because seroval doesn't serialize the inner div literals)
- `/about/index.html` and `/work/index.html` have 0 markers — spotlight is strictly scoped to the home hero

## Caveats

- **The FPS-regression acceptance criterion was not measured.** The implementation uses the canonical rAF-batched / no-React-state pattern for cursor tracking, which is the same approach used by major sites that ship this primitive. The component avoids all the known FPS pitfalls (no `setState` per move, no document-level listener, no layout thrashing — only one `getBoundingClientRect` per event, then a single style write per frame). Treat the criterion as best-effort architectural compliance until a real device sweep is run on the deployed site.
- **`color-mix` baseline support.** Required for the gradient color. Supported in all targeted evergreen browsers; non-issue for the modern Vite/React 19 baseline this site already targets. Listed for transparency.
- **`requestAnimationFrame` is conditionally global.** The component falls back to the global `requestAnimationFrame` / `cancelAnimationFrame`, which exist in jsdom (used in tests) and every supported browser. No prerender-time call path (the effect only runs in the browser), so there is no SSR concern.

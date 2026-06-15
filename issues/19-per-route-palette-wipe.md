# Per-route palette + dark↔paper wipe via View Transitions

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Wire per-route palette selection in the root layout so `__root.tsx` reads the current route id and applies `data-palette="dark"` or `data-palette="paper"` to `<html>`. Dark routes: `/`, `/work`, `/work/$slug`, `/contact`, `/404`, `/500`. Paper routes: `/writing`, `/writing/$slug`, `/about`. The CSS tokens from slice #18 resolve to the right palette via this attribute.

When the user navigates across a palette boundary, a top-to-bottom palette wipe runs via the View Transitions API (~280ms, ease-out). When `document.startViewTransition` is undefined the wipe is skipped and the palette flips instantly with the new page render. Under `prefers-reduced-motion: reduce` the wipe is always skipped.

No page content visually changes in this slice — only the body background, default text color, and accent color reflect the route's palette. Components added in later slices will read from the same tokens.

## Acceptance criteria

- [ ] `__root.tsx` (or equivalent root layout) sets `data-palette` on `<html>` based on the current route
- [ ] Dark vs paper routes mapped per PRD; verified by iterating routes in tests
- [ ] Cross-palette navigation triggers a top-to-bottom wipe via View Transitions API (~280ms)
- [ ] When `document.startViewTransition` is undefined, navigation completes without invoking it
- [ ] Under `prefers-reduced-motion: reduce`, the palette flip is instant — no wipe
- [ ] Vitest covers: `data-palette` matches the current route, fallback when VT API absent, fallback under reduced motion
- [ ] `e2e/smoke.spec.ts` extended to assert `data-palette` per route
- [ ] `e2e/reduced-motion.spec.ts` extended to assert instant palette change on `/` → `/writing`
- [ ] Existing tests stay green

## Blocked by

- #18

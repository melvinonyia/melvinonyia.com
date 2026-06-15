# `<CursorSpotlight>` on the home hero

## What to build

Implement `<CursorSpotlight>` — a wrapper element that paints a soft radial gradient driven by two CSS custom properties (`--mx`, `--my`) updated by a throttled `requestAnimationFrame` `mousemove` handler scoped to its own bounding box. Listener attaches on mount, detaches on unmount, and is never global.

Mount one instance on the home hero region. Outside the hero, the spotlight has no visual effect. Touch devices and `prefers-reduced-motion` users see no spotlight at all (the wrapper renders as a no-op transparent layer).

## Acceptance criteria

- [ ] `<CursorSpotlight>` exposes a wrapper that paints a radial gradient via CSS custom properties
- [ ] Pointer tracking is scoped to the wrapper, not the document; cleaned up on unmount
- [ ] Updates batched via `requestAnimationFrame`; no per-event React state churn
- [ ] Touch detection makes the component a transparent no-op
- [ ] `prefers-reduced-motion: reduce` makes the component a transparent no-op
- [ ] Mounted on the home hero only
- [ ] RTL test: renders, exposes role-of-presentation, honors mocked reduced-motion and pointer-coarse
- [ ] No FPS regression observable in DevTools during a 10s hover sweep on a mid-spec laptop

## Blocked by

- #2 (Home hero)

# HoverLift retune as typographic rule reveal

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rewrite `HoverLift` so its hover and `:focus-visible` state renders a brick rule that brightens and a child title that shifts a few pixels in a spring (via Motion). Under `prefers-reduced-motion: reduce`, the motion-driven shift is replaced by a CSS-only fallback: the rule brightens, the title stays still, no Motion-driven hook is invoked.

The component's public API (children, optional radius/amplitude props, focus behavior) stays compatible with current callsites so downstream slices can adopt it without rewiring. Tests assert the rule element renders, hover/focus-visible state brightens it, and the reduced-motion path skips Motion entirely.

Visual change at existing callsites is expected and intentional — those callsites are rebuilt in later slices anyway.

## Acceptance criteria

- [ ] `HoverLift` re-implemented as a rule-reveal interaction (rule + title shift via spring)
- [ ] CSS-only fallback under `prefers-reduced-motion: reduce` — no Motion hook invoked
- [ ] Public component API stable enough that current callsites compile without changes
- [ ] `HoverLift.test.tsx` updated: rule rendered, hover/focus brightens it, reduced-motion path skips Motion
- [ ] Existing callsites still render (visual change expected; behavior unchanged)
- [ ] Existing tests stay green

## Blocked by

- #18

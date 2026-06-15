# `<HoverLift>` + home case-study cards + latest-essay preview

## What to build

Implement two things that ship together:

1. The `<HoverLift>` interaction primitive — wraps any block, raises it by a small translate-Y and changes its shadow on `:hover` and `:focus-visible`. CSS-only path when `prefers-reduced-motion: reduce` is set; Motion spring path otherwise. Touch devices get an active-press state instead of hover lift.
2. The home page expansion — below the hero, render three case-study cards (driven by the `/work` content collection, taking the first three reverse-chronologically) and a latest-essay preview block (title, date, blurb, link from the `/writing` collection). Every card and the essay preview is wrapped in `<HoverLift>`.

Cards remain plain `<Link>` navigation for now — view transitions arrive in slice #10.

## Acceptance criteria

- [ ] `<HoverLift>` component exposed as a reusable primitive
- [ ] Touch detection makes `<HoverLift>` a no-op for hover (active-press substituted)
- [ ] `<HoverLift>` honors `prefers-reduced-motion: reduce` (no spring; instant state)
- [ ] Home page below-hero region renders 3 case-study cards from the `/work` collection
- [ ] Home page renders a latest-essay preview block from the `/writing` collection (gracefully hidden when no essays exist)
- [ ] Cards and preview block use `<HoverLift>` and remain operable by keyboard with visible focus states
- [ ] RTL test for `<HoverLift>`: renders children, exposes correct ARIA, honors mocked `matchMedia` reduced-motion

## Blocked by

- #2 (Home hero)
- #4 (MDX content collection + /work)
- #6 (Writing index + detail)

# `<MagneticLink>` on nav and primary CTAs

## What to build

Implement `<MagneticLink>` — wraps an `<a>` or `<button>`, listens for `mousemove` within an opt-in radius (default 40px), and translates the inner child with a spring-damped offset toward the cursor. Releases on `mouseleave`. The click target geometry of the underlying link is preserved (the parent does not move, the child does), so the cursor lands where the user expects.

Wire `<MagneticLink>` into the header nav links and the home page's primary CTAs (e.g. "see work", "contact"). Touch devices and `prefers-reduced-motion` users receive a plain link with no magnetic behavior.

## Acceptance criteria

- [ ] `<MagneticLink>` accepts standard anchor/button props and renders the underlying element
- [ ] Magnetic pull is bounded by configurable radius and max-offset (defaults set)
- [ ] Click target of the underlying link is unaffected by the child translation (verified by a synthetic-offset click test)
- [ ] Touch detection disables magnetic behavior
- [ ] `prefers-reduced-motion: reduce` disables magnetic behavior
- [ ] Wired into header nav and home primary CTAs
- [ ] RTL tests: renders children, exposes correct semantics, honors mocked reduced-motion
- [ ] Click target accuracy asserted under a synthetic cursor offset

## Blocked by

- #3 (Nav + footer + About)

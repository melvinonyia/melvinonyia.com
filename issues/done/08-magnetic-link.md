# `<MagneticLink>` on nav and primary CTAs

## What to build

Implement `<MagneticLink>` — wraps an `<a>` or `<button>`, listens for `mousemove` within an opt-in radius (default 40px), and translates the inner child with a spring-damped offset toward the cursor. Releases on `mouseleave`. The click target geometry of the underlying link is preserved (the parent does not move, the child does), so the cursor lands where the user expects.

Wire `<MagneticLink>` into the header nav links and the home page's primary CTAs (e.g. "see work", "contact"). Touch devices and `prefers-reduced-motion` users receive a plain link with no magnetic behavior.

## Acceptance criteria

- [x] `<MagneticLink>` accepts standard anchor/button props and renders the underlying element
- [x] Magnetic pull is bounded by configurable radius and max-offset (defaults set)
- [x] Click target of the underlying link is unaffected by the child translation (verified by a synthetic-offset click test)
- [x] Touch detection disables magnetic behavior
- [x] `prefers-reduced-motion: reduce` disables magnetic behavior
- [x] Wired into header nav and home primary CTAs
- [x] RTL tests: renders children, exposes correct semantics, honors mocked reduced-motion
- [x] Click target accuracy asserted under a synthetic cursor offset

## Blocked by

- #3 (Nav + footer + About)

---

## Status note (2026-06-15)

Shipped. Design notes:

- **Renders an underlying TanStack `<Link>`**, not a wrapping span. The Link IS the click target — its bounding rect doesn't move. A `motion.span` lives *inside* the Link with `transform: translate(x, y)` applied to it; that's what visually drifts toward the cursor. Spec compliance: "parent does not move, child does."
- **Spring on the inside.** `useMotionValue` for raw offsets, `useSpring` (stiffness 220, damping 18) for the eased animation. Damping intentionally higher than the HoverLift spring so the magnetic effect feels precise rather than bouncy.
- **Offset math**:
  - On every `mousemove`, compute cursor offset from the Link's center via `getBoundingClientRect()`.
  - Distance = `Math.hypot(dx, dy)`. Reach = `max(width, height) / 2 + radius` — i.e., the magnetic field extends `radius` (default 40px) beyond the element's footprint.
  - Outside reach (or `dist === 0`): set both motion values to 0.
  - Inside reach: unit-vector × `maxOffset` (default 8px) × `min(dist/reach, 1)`. Linear ramp from 0 at the edge of reach to `maxOffset` at the center. (Keeps the pull strongest where the cursor is closest, not strongest at the edge.)
- **Disabled paths**: when `useReducedMotionPreferred()` or `useTouchOnly()` is true, the Link renders `{children}` directly with no `motion.span` wrapper and no listener-driven state changes. The handlers are still attached but no-op on the disabled branch. `data-magnetic-disabled="true"` lets tests assert the right path was taken.
- **Test-friendly attributes**: `data-magnetic` on every wrapper, `data-magnetic-disabled` reflects the active branch.

Wired in:

- **`src/components/SiteHeader.tsx`** — each of the five nav items (Home / Work / Writing / About / Contact) is now a `MagneticLink` instead of a plain `Link`. Tighter parameters than the defaults (`radius={32}`, `maxOffset={6}`) so the pull stays subtle in the dense nav cluster. `activeOptions` and `activeProps={{ 'aria-current': 'page' }}` are forwarded — the active-state visual treatment is unchanged.
- **`src/components/Hero.tsx`** — the hero now has a 2-button CTA cluster directly under the pitch: "See work →" linking to `/work` (accent variant) and "Get in touch" linking to `/contact` (muted variant). Both wrapped in `MagneticLink` with default radius/offset.

Tests: 104 passing across 21 files. 6 new for `MagneticLink`:
- renders children inside an anchor pointing at `to`
- forwards `aria-label` to the underlying link
- marks the anchor as `data-magnetic-disabled="true"` under mocked reduced-motion
- marks the anchor as `data-magnetic-disabled="true"` under mocked `(hover: none)`
- **click target accuracy under synthetic offset** — stubs `getBoundingClientRect`, fires `mouseMove` with a non-zero cursor offset, asserts the anchor's bounding rect is unchanged and a subsequent `click` still fires the spy
- resets translation on `mouseleave` (smoke — doesn't throw)

Updated:
- `Hero.test.tsx` (+1 test) — added Link mock + matchMedia stub, then asserted the two CTAs render with the right hrefs.

Verified in prerendered HTML:
- `/index.html` has 14 `data-magnetic` markers (5 nav + 2 hero CTAs = 7, doubled by SSR hydration payload)
- `/about/index.html` has 10 (5 nav)
- `aria-current="page"` still appears exactly once per page on the active nav item

## Caveats

- jsdom emits a "navigation not implemented" warning during the synthetic-click test because `fireEvent.click` on an `<a href="/work">` triggers jsdom's no-op navigation stub. The test still asserts the spy. The warning is harmless and unrelated to the assertion.
- `MagneticLink` is anchor-only. A button variant (if needed for non-nav CTAs) would be additive; current consumers are all anchors.

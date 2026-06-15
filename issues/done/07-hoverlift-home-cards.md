# `<HoverLift>` + home case-study cards + latest-essay preview

## What to build

Implement two things that ship together:

1. The `<HoverLift>` interaction primitive — wraps any block, raises it by a small translate-Y and changes its shadow on `:hover` and `:focus-visible`. CSS-only path when `prefers-reduced-motion: reduce` is set; Motion spring path otherwise. Touch devices get an active-press state instead of hover lift.
2. The home page expansion — below the hero, render three case-study cards (driven by the `/work` content collection, taking the first three reverse-chronologically) and a latest-essay preview block (title, date, blurb, link from the `/writing` collection). Every card and the essay preview is wrapped in `<HoverLift>`.

Cards remain plain `<Link>` navigation for now — view transitions arrive in slice #10.

## Acceptance criteria

- [x] `<HoverLift>` component exposed as a reusable primitive
- [x] Touch detection makes `<HoverLift>` a no-op for hover (active-press substituted)
- [x] `<HoverLift>` honors `prefers-reduced-motion: reduce` (no spring; instant state)
- [x] Home page below-hero region renders 3 case-study cards from the `/work` collection (currently 2, capped at 3)
- [x] Home page renders a latest-essay preview block from the `/writing` collection (gracefully hidden when no essays exist)
- [x] Cards and preview block use `<HoverLift>` and remain operable by keyboard with visible focus states
- [x] RTL test for `<HoverLift>`: renders children, exposes correct ARIA, honors mocked `matchMedia` reduced-motion

## Blocked by

- #2 (Home hero)
- #4 (MDX content collection + /work)
- #6 (Writing index + detail)

---

## Status note (2026-06-15)

Shipped. The work split:

- **`motion` installed** (`motion@^12.40.0` — the new package name for framer-motion v11+). Lands as a runtime dep so it's available to future slices (#08 MagneticLink, etc.).
- **Pointer-capability hooks** at `src/lib/motion/usePointerCapabilities.ts`:
  - `useReducedMotionPreferred()` — matches `(prefers-reduced-motion: reduce)`. SSR default: `false` so the server renders the motion path (browsers self-correct if they prefer reduced motion on hydrate).
  - `useTouchOnly()` — matches `(hover: none)`. SSR default: `false` so the server renders the hover path.
  - Both react to media-query change events (e.g., user toggles OS-level reduced motion mid-session).
- **`HoverLift`** (`src/components/HoverLift.tsx`) — wraps children in `motion.div` with three branches:
  - Pointer + normal motion: `whileHover`/`whileFocus` lift to `y: -4` + drop shadow, spring transition (`stiffness: 320, damping: 26`).
  - Pointer + reduced motion: same target states, but transition is `{ duration: 0 }` (instant).
  - Touch device: `whileHover` / `whileFocus` are undefined (no-op); `whileTap` applies `scale: 0.985` for the active-press feel.
  - Test-friendly data attributes (`data-hover-lift`, `data-reduced-motion`, `data-touch-only`) make the active branch assertable.
- **`HomeFeatureSection`** (`src/components/HomeFeatureSection.tsx`) — composes two card kinds:
  - `CaseStudyCard` rendered for each `WorkPostSummary` (caller is responsible for limiting; the home loader slices to first 3 reverse-chrono).
  - `EssayPreview` rendered for the latest `EssaySummary`; the whole block is omitted gracefully when `latestEssay === null`.
  - Section header has a small "All work →" jump link; the essay block has the matching "All writing →" link.
  - Each card and the essay preview is wrapped in `<HoverLift>`. Inner anchors keep their own focus rings.
- **Home route** (`src/routes/index.tsx`) — loader reads `getWorkPostSummaries().slice(0, 3)` + `getEssaySummaries()[0] ?? null` and hands them to `HomeFeatureSection`. Placeholder `<p>selected work and recent writing — incoming.</p>` is gone.

Tests: 97 passing across 20 files. 16 new for this slice:
- `usePointerCapabilities.test.tsx` (6) — reduced-motion match / no-match, touch-only match / no-match, change-event reactivity for both
- `HoverLift.test.tsx` (5) — renders children, ARIA passthrough, marks wrapper with reduced-motion / touch-only / neither, all via mocked matchMedia
- `HomeFeatureSection.test.tsx` (5) — work cards link to detail, "All work →" jump link, latest-essay block when essay provided, omitted when null, both card kinds wrapped in HoverLift

Verified in prerendered `/index.html`:
- "Selected work" + "All work →" jump link present
- Both work cards in the page: `Movement fingerprint engine`, `Gait lab toolkit`
- "Latest essay" badge + `The leg between lab and field` + "All writing →"
- 3 `data-hover-lift` wrappers (2 work cards + 1 essay preview)

## Caveats / handoffs

- The home cap is 3, but only 2 fixtures exist — third card slot is currently empty. Lands naturally as the third case study gets written.
- Visual styling of cards is functional but minimal (bordered surface, hover bg shift). Designed to evolve. Cards remain plain `<Link>` until slice #10 wires the View Transitions API.
- A no-CLS / no-jank measurement for the hover-spring effect lives in slice #16 (Lighthouse pass).

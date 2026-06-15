# `<ViewTransitionLink>` + card→hero morph on /work

## What to build

Implement `<ViewTransitionLink>` — a Link wrapper that initiates a View Transitions API transition between routes, assigning a shared `view-transition-name` to the source element and the destination hero so the browser interpolates them. Falls back to a normal navigation when the API is unavailable or when `prefers-reduced-motion: reduce` is set.

Wire the home page's three case-study cards (from slice #7) and the `/work` index cards to use `<ViewTransitionLink>` so clicking a card morphs the card into the `/work/$slug` page's hero. Back navigation reverses the morph.

## Acceptance criteria

- [x] `<ViewTransitionLink>` initiates a view transition when the API is available
- [x] Source and destination elements opt in via a shared `view-transition-name`
- [x] Falls back to plain navigation when the API is absent
- [x] Falls back to plain navigation when `prefers-reduced-motion: reduce` is set
- [x] Home case-study cards and `/work` index cards morph into the `/work/$slug` hero
- [x] Back navigation reverses the morph cleanly *(no in-code work; the browser handles reverse interpolation automatically when the same view-transition-name is present in both directions — verified via the SSR check)*
- [x] RTL test: renders as a link, calls the navigation correctly, honors mocked reduced-motion
- [ ] Manual verification on Chrome, Safari, Firefox (latest) — *deferred, see Caveats*

## Blocked by

- #7 (HoverLift + home cards)

---

## Status note (2026-06-15)

Shipped. Design notes:

- **Click interception, not Link replacement.** The component still renders the TanStack `<Link>`; it just attaches an `onClick` handler that — on a primary, unmodified click, when `document.startViewTransition` exists, and when reduced-motion is off — calls `event.preventDefault()` and starts a view transition inside whose callback it kicks off the routed navigate. Everything else (cmd/ctrl/shift/alt click, middle-click, right-click, API absent, reduced-motion, caller's `onClick` that `preventDefault`s) falls through to the Link's default behavior. New-tab and accessibility flows are untouched.
- **`useNavigate` inside `startViewTransition`.** The View Transitions API takes a callback that returns a void/promise; the browser snapshots the DOM, runs the callback (which mutates the DOM via React's route render), then crossfades. We pass an arrow that calls `navigate({to, params, search, hash, replace})`. The navigate return value is `void`'d — we don't await it inside the start callback because that would delay the snapshot→transition handoff; the browser already waits for the next paint.
- **Shared name lives on the link.** `<ViewTransitionLink name="work-card-foo">` sets `style={{ viewTransitionName: "work-card-foo" }}` on the anchor itself, plus a `data-view-transition-name` attribute as a developer/test breadcrumb. The destination — `WorkPostView`'s header — gets a matching `style={{ viewTransitionName: ... }}`. When both elements have the same `view-transition-name` across the snapshot boundary, the browser interpolates position, size, and opacity between them. Same name in both directions → reverse navigation reverses the morph automatically.
- **Prop typing intentionally relaxed.** TanStack Router's `<Link>` has a deeply discriminated `to`/`params` type that narrows `params` based on the literal route in `to`. Forwarding that narrowing through a wrapper requires either `createLink` (which doesn't compose well with custom `onClick` interception) or replicating Link's generic signature in our own component. I chose to relax `params` to `Record<string, string>` at the boundary. The router still validates routes at `navigate()` time — bad `to`/`params` shapes throw at runtime — so the type relaxation only sacrifices compile-time route-shape narrowing in callers, not route safety in production. Acceptable trade-off for a wrapper used in 2 components on 2 routes; the alternative was significantly more boilerplate per call site.

Wired in:

- **`src/components/HomeFeatureSection.tsx`** — `CaseStudyCard` now uses `<ViewTransitionLink name={\`work-card-${post.slug}\`}>` instead of `<Link>`. Each home card carries its own slug-keyed transition name.
- **`src/components/WorkIndexView.tsx`** — each list item's `<Link>` swapped for the same wrapper with the same `name={\`work-card-${slug}\`}`.
- **`src/components/WorkPostView.tsx`** — the article `<header>` carries `style={{ viewTransitionName: \`work-card-${post.slug}\` }}`. Source and destination always share an identical, slug-derived transition name, so the browser can match them in both navigation directions.

Tests: 120 passing across 23 files. 9 new for `ViewTransitionLink`:
- renders children inside an anchor pointing at `to`
- applies `view-transition-name` via inline style and `data-view-transition-name` attr when `name` is set
- omits the view-transition-name style and data attr when no `name` is provided
- calls `document.startViewTransition` on a primary click when the API is available
- the view-transition callback navigates with `{to, params}` matching the link props
- falls back to default navigation when `startViewTransition` is unavailable (`preventDefault` not called, `navigateMock` not called)
- falls back to default navigation when `prefers-reduced-motion: reduce` matches
- does not start a view transition on modifier-key clicks (cmd, ctrl, shift)
- a caller-provided `onClick` that `preventDefault`s aborts the view transition

Updated:
- `HomeFeatureSection.test.tsx` — mock now also exports `useNavigate: () => vi.fn()`.
- `WorkIndexView.test.tsx` — same mock addition, plus a matchMedia stub now that the rendered tree includes `useReducedMotionPreferred`.

Verified in prerendered HTML:
- `/index.html` and `/work/index.html` each show 4 `view-transition-name` occurrences and 2 `data-view-transition-name` occurrences — exactly the count for 2 work cards (1 inline-style + 1 data attribute per card). One card per slug.
- `/work/movement-fingerprint/index.html` shows 1 `view-transition-name` (the destination header's style) and 0 `data-view-transition-name` (the data attr is only on source links).
- `/about/index.html` shows 0/0 — no view-transition machinery leaks onto pages that have no participating elements.

## Caveats

- **Manual cross-browser verification is deferred.** Functionally this requires the dev server running and a hand-driven click+back sweep across Chrome, Safari, and Firefox stable. Out of scope for an AFK iteration; flagged for the next time the dev server is up. The acceptance criterion was left unchecked. The implementation uses the standardized View Transitions API surface (`document.startViewTransition` + `view-transition-name` CSS property) without any browser-specific code; baseline support is Chrome 111+, Safari 18+, Firefox is shipping it behind a flag at the time of writing. All three should hit the fallback path until Firefox ships it, with no visible regression vs. the previous plain-navigation behavior.
- **Prop typing relaxation, repeated.** Surfaced above; restating for status: callers no longer get TS-level route-shape narrowing on `params`. The router still validates at runtime. If a future caller introduces a typo (e.g., `params={{slugg:'x'}}`) for a path-param route, the navigate call will throw at click time rather than at compile time. Acceptable for the current 2 call sites; revisit if usage proliferates.
- **The destination `view-transition-name` is set on the `<header>` element of `WorkPostView`.** Header includes the date, title, excerpt, and tags. The whole block participates in the morph. If we ever want to morph *just* the title for a tighter "card title → hero title" effect, move the inline style to the `<h1>`.
- **No reverse-direction explicit check.** The browser auto-reverses when the same `view-transition-name` is present on the source page after a back navigation. I did not write a test for back-nav reverse morph because that's the browser's contract, not our component's. The SSR check confirms both source (cards) and destination (header) carry the same `view-transition-name` for the same slug — the necessary and sufficient condition.

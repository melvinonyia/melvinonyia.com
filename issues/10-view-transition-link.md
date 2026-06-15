# `<ViewTransitionLink>` + card→hero morph on /work

## What to build

Implement `<ViewTransitionLink>` — a Link wrapper that initiates a View Transitions API transition between routes, assigning a shared `view-transition-name` to the source element and the destination hero so the browser interpolates them. Falls back to a normal navigation when the API is unavailable or when `prefers-reduced-motion: reduce` is set.

Wire the home page's three case-study cards (from slice #7) and the `/work` index cards to use `<ViewTransitionLink>` so clicking a card morphs the card into the `/work/$slug` page's hero. Back navigation reverses the morph.

## Acceptance criteria

- [ ] `<ViewTransitionLink>` initiates a view transition when the API is available
- [ ] Source and destination elements opt in via a shared `view-transition-name`
- [ ] Falls back to plain navigation when the API is absent
- [ ] Falls back to plain navigation when `prefers-reduced-motion: reduce` is set
- [ ] Home case-study cards and `/work` index cards morph into the `/work/$slug` hero
- [ ] Back navigation reverses the morph cleanly
- [ ] RTL test: renders as a link, calls the navigation correctly, honors mocked reduced-motion
- [ ] Manual verification on Chrome, Safari, Firefox (latest)

## Blocked by

- #7 (HoverLift + home cards)

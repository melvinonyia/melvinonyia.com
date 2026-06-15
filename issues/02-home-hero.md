# Home hero: sparse identity above the fold

## What to build

Implement the `/` route as a sparse, server-rendered hero containing Melvin's name, current role, and a one-line pitch. No interactivity yet — this slice is about getting the right content arriving at the right URL with the right type and spacing, so a recruiter would form an opinion in five seconds. Below the hero, leave a placeholder region for the case-study cards and latest-essay preview that arrive in later slices.

The hero typography is the load-bearing design moment: Söhne weight contrast (Buch vs Halbfett) carries the hierarchy.

## Acceptance criteria

- [ ] `/` route exists and SSRs name, role, and one-line pitch above the fold
- [ ] Type uses Söhne weights pulled from CSS tokens; no inline literal weights
- [ ] Layout passes a manual check at 1440px, 1024px, 768px, 375px viewports
- [ ] Lighthouse Performance ≥ 95 on desktop for the route in isolation
- [ ] SSR `<head>` snapshot test asserts title, description, canonical, OG tags

## Blocked by

- #1 (Bootstrap)

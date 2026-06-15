# Playwright smoke + Lighthouse pass + reduced-motion sweep

## What to build

Add the end-to-end quality pass that proves the "alive" loop works and that the quality bar is met before launch:

- **Playwright smoke** covers: home loads with content above the fold; ⌘K opens, fuzzy search returns hits, Enter navigates; clicking a case-study card on home navigates correctly with or without view transitions; magnetic-link click targets are accurate when the cursor is offset within the magnetic radius; contact form happy path submits and shows the inline success state.
- **Lighthouse pass** is run against the production build for the five primary routes. Targets: desktop Performance / Accessibility / Best Practices / SEO ≥ 95; mobile ≥ 90 on the same axes.
- **Reduced-motion sweep** runs through every interactive primitive with `prefers-reduced-motion: reduce` simulated, asserting that view transitions, magnetic pull, hover lift, cursor spotlight, and Cmd-K open/close are all instant.

Playwright runs in CI on every PR. The Lighthouse and reduced-motion sweeps run before tagging the release.

## Acceptance criteria

- [ ] Playwright smoke suite covers ⌘K open → search → navigate, view-transition navigation, magnetic click accuracy, contact form happy path
- [ ] Playwright runs in CI against a built preview
- [ ] Lighthouse CI run against the production build of `/`, `/work`, `/work/$slug`, `/writing`, `/about`, `/contact`
- [ ] Desktop scores ≥ 95 on Performance, Accessibility, Best Practices, SEO for all six routes
- [ ] Mobile scores ≥ 90 on Performance, Accessibility, Best Practices, SEO for all six routes
- [ ] Reduced-motion sweep test asserts: VT falls back to instant nav, hover lift becomes instant, cursor spotlight is a no-op, magnetic pull is a no-op, Cmd-K open/close is instant
- [ ] Failures block the release tag

## Blocked by

- #1 through #15 (all preceding slices)

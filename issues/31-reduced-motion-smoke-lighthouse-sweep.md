# Reduced-motion + smoke + Lighthouse sweep

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

The final pass that closes the redesign. Extend `e2e/reduced-motion.spec.ts` to cover the serif morph and dark↔paper palette wipe: under `prefers-reduced-motion: reduce`, navigating home → `/work/$slug` does not run the view transition (instant navigation, no transition name applied), and navigating `/` → `/writing` completes the palette change instantly.

Extend `e2e/smoke.spec.ts` to assert each route loads and renders both the masthead and the correct `data-palette` (some of this was wired in #19 / #20 — confirm it holds end-to-end after every slice).

Run Lighthouse via the existing `lighthouserc.json` against the deployed redesign and confirm the Performance ≥ 95 desktop floor still holds with the added display serif. If the floor breaches, tune `font-display` strategy and preload hints until it holds.

Run `npm run smoke:prod` against the production URL as the final manual verification.

## Acceptance criteria

- [ ] `reduced-motion.spec.ts` asserts: home → `/work/$slug` runs instant navigation under reduced-motion, no view transition fires
- [ ] `reduced-motion.spec.ts` asserts: `/` → `/writing` palette change is instant under reduced-motion
- [ ] `smoke.spec.ts` asserts: every route renders masthead + the correct `data-palette` attribute
- [ ] Lighthouse Performance ≥ 95 on desktop on the deployed redesign — recorded in PR
- [ ] `npm run smoke:prod` passes against the deployed URL
- [ ] Manual verification documented in PR: serif morph fires, palette wipe runs, CmdK feels right, both palettes look correct
- [ ] All previous slices' tests stay green

## Blocked by

- #19
- #22
- #23
- #24
- #30

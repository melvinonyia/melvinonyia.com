# Masthead + footer rebuild — mono bar, route labels, ⌘K hint

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild `SiteHeader` as a thin mono bar (~48px) that adopts the current palette: `MELVIN ONYIA` top-left in Berkeley Mono ~12px, route labels right-aligned in mono uppercase (`WORK` / `WRITING` / `ABOUT` / `CONTACT`), `⌘K` hint at the right edge, hairline rule beneath.

Rebuild `SiteFooter` to mirror the masthead language — mono name, minimal links cluster, `⌘K` hint, hairline top rule. Both adopt the current route's `data-palette` automatically (no per-route forking).

Tests assert rendered structure, accessible roles and labels (the `⌘K` hint carries the right `aria-keyshortcuts`), and presence on every route via the existing Playwright smoke iteration.

## Acceptance criteria

- [ ] `SiteHeader` rebuilt to the masthead spec; visible on every route
- [ ] `SiteFooter` rebuilt to mirror the masthead language
- [ ] Both components adopt the current palette via the `data-palette` attribute from #19
- [ ] `aria-keyshortcuts` on the `⌘K` affordance is correct
- [ ] `SiteHeader.test.tsx` and `SiteFooter.test.tsx` updated to assert new structure + a11y
- [ ] `e2e/smoke.spec.ts` asserts masthead is present on every route
- [ ] Existing tests stay green

## Blocked by

- #18
- #19

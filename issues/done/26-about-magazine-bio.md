# /about: magazine-bio on paper

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild `AboutView` on paper as the magazine colophon: serif `ABOUT` title, 2–3 paragraph bio at essay measure (~68ch), mono dateline (current role + location), mono links cluster (GitHub / LinkedIn / X / email) with a brick hover rule via the retuned `HoverLift`, and a serif contact CTA linking to `/contact`.

The page reuses the typographic system established by #24 and #25 — no new tokens or primitives are introduced. The palette attribute is `paper` (already wired in #19).

## Acceptance criteria

- [ ] `/about` rebuilt on paper: serif `ABOUT` title, bio paragraphs, mono dateline, mono links cluster, serif contact CTA
- [ ] Links cluster uses retuned `HoverLift` (rule reveal)
- [ ] Page renders correctly with `data-palette="paper"`
- [ ] `AboutView.test.tsx` updated for new structure
- [ ] Existing tests stay green

## Blocked by

- #18
- #19
- #20
- #21

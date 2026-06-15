# /work full-bleed spreads + /work/$slug morph landing

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild `WorkIndexView` as a vertical scroll of full-bleed editorial spreads. Each spread: serif project title (the View Transitions morph source), mono dateline (`CLIENT — ROLE — YEAR`), full-bleed hero image, one-paragraph teaser in Söhne. Hero imagery may use placeholder fills — real imagery is sourced out-of-band per the PRD's "Further Notes". Each spread wraps `ViewTransitionLink` with the same slug-derived transition name convention introduced in #22.

Rebuild `WorkPostView`'s top region: index number (mono) + serif title (the morph landing element, same transition name) + mono dateline + full-bleed hero image. The MDX body and inline `<Demo />` islands below the top region are unchanged.

Together, the morphs work end-to-end: home index row → `/work/$slug` page header, and `/work` spread title → `/work/$slug` page header, both with a clean instant fallback when the View Transitions API is absent.

## Acceptance criteria

- [ ] `WorkIndexView` rebuilt as full-bleed spreads (zero/one/many case studies all render correctly)
- [ ] Each spread renders serif title, mono dateline, hero image (placeholder allowed), Söhne teaser
- [ ] `WorkPostView` top region: index number + serif title + mono dateline + full-bleed hero image; MDX body region preserved
- [ ] Morph source on `/work` and `/work/$slug` landing element share a stable view-transition name (same convention as #22)
- [ ] Morph from home index (#22) to `/work/$slug` also works
- [ ] When the View Transitions API is absent, navigation completes instantly with no visual break
- [ ] `WorkIndexView.test.tsx` and `WorkPostView.test.tsx` updated for the new structure
- [ ] Existing tests stay green

## Blocked by

- #18
- #21
- #22

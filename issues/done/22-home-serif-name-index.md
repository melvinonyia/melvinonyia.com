# Home: oversized serif name + numbered case-study index

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild the `/` route as a single typographic statement. Above the fold: oversized display serif name (`Melvin Onyia`) at `clamp(96px, 14vw, 200px)`, mono role and one-line pitch as a dateline beneath. Below the fold: a numbered editorial case-study index — `01`, `02`, `03` in mono on the left, serif project titles, one-line mono descriptions, year on the right.

Each row wraps `ViewTransitionLink` so the serif title is the morph source toward `/work/$slug` (the landing pad arrives in slice #23). The view-transition name should be derived from the slug using a stable convention shared with `/work` and `/work/$slug`. Each row uses the retuned `HoverLift` (#21) for its rule-reveal hover.

The home no longer renders `CursorSpotlight` or `MagneticLink` — their JSX subtrees are removed from `Hero`, `HomeFeatureSection`, and `index.tsx`. The component files themselves are NOT deleted in this slice; that happens in #30 once every callsite is gone. No images on the home.

## Acceptance criteria

- [ ] `/` renders the oversized serif name + mono dateline + numbered index, single composed page
- [ ] Case-study index rows: index number (mono), serif title, mono description, year
- [ ] Each row wraps `ViewTransitionLink` with a stable view-transition target name on the serif title (slug-derived)
- [ ] Each row uses retuned `HoverLift` for rule-reveal hover
- [ ] `CursorSpotlight` and `MagneticLink` no longer rendered on the home (component files retained for #30)
- [ ] No images on the home
- [ ] `Hero.test.tsx` and `HomeFeatureSection.test.tsx` updated: serif name + dateline + index rows render, no `CursorSpotlight` subtree present, view-transition target attribute on row titles
- [ ] Existing tests stay green

## Blocked by

- #18
- #20
- #21

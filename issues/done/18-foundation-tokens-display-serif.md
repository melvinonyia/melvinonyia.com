# Foundation: design tokens + display serif + WCAG brick check

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Lay the typographic and color foundation that every other redesign slice depends on. Pick the display serif (HITL — choose between GT Super Display, Tiempos Headline, and Editorial New), self-host the chosen face and its required weights with `preload` hints, and add the new color tokens to `globals.css` and the Tailwind theme: dark palette refined (warm-tinted near-black background, warm off-white foreground), paper palette (warm cream background, near-black foreground), and warm brick accent `#D87C4A`.

Both palettes are declared as parallel CSS custom property blocks — one default (`dark`), one keyed by a `data-palette="paper"` attribute on `<html>`. The Tailwind theme exposes the same tokens so utilities resolve from a single source. Verify WCAG AA contrast for `#D87C4A` against both palette backgrounds and against warm off-white text, and record the results in the PR description. If any use case fails contrast, the use case is dropped — the accent is not changed.

No route or component is visually rebuilt in this slice. It is foundation that downstream slices consume. The HITL gate is the serif decision; implementation runs once the user confirms the pick.

## Acceptance criteria

- [ ] Display serif final pick confirmed; chosen face self-hosted with `preload` hints
- [ ] Font weights restricted to those actually used by the design
- [ ] CSS custom property tokens in `globals.css`: dark palette (bg, fg, accent), paper palette (bg, fg, accent), `data-palette="paper"` selector switches them
- [ ] Tailwind theme exposes matching tokens so utilities resolve from a single source
- [ ] WCAG AA contrast for `#D87C4A` verified against both palette backgrounds and against warm off-white text; results recorded in PR
- [ ] No route or component visually changes in this slice on its own
- [ ] `typecheck`, `build`, and existing tests stay green

## Blocked by

None — can start immediately (HITL gate: serif pick).

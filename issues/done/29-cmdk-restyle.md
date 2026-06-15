# CmdK restyle — mono input + serif titles + brick rule active

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Restyle `CommandPalette` to the new aesthetic. Centered panel ~640px wide. Mono input with a brick caret. Result rows: serif item title (case studies / essays) + mono kind tag (`WORK` / `ESSAY` / `EXTERNAL`) right-aligned + mono shortcut hint. The active row has a brick left-edge rule (no background fill). Backdrop is the current route palette's background at ~70% opacity with a blur.

Keyboard-first behavior (`ArrowUp` / `ArrowDown` / `Enter` / `Esc`) and search behavior are unchanged from v1. `CommandPaletteController` is untouched — only the rendered palette visual changes.

## Acceptance criteria

- [ ] Panel centered, ~640px wide
- [ ] Mono input renders with brick caret
- [ ] Result rows: serif title + mono kind tag + mono shortcut hint
- [ ] Active row has brick left-edge rule; no background fill
- [ ] Backdrop adopts current palette + blur at ~70% opacity
- [ ] Keyboard behavior (`ArrowUp`, `ArrowDown`, `Enter`, `Esc`) preserved
- [ ] `aria-selected` or equivalent data attribute marks the active row for the rule highlight
- [ ] `CommandPalette.test.tsx` updated for new structure + active-row attribute
- [ ] Existing tests stay green

## Blocked by

- #18

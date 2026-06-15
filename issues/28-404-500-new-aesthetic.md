# 404 + 500 in new aesthetic

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild `NotFoundView` and `ServerErrorView` in the new aesthetic on the dark palette: serif error code (`404`, `500`) at display size, mono dateline (e.g. `PAGE NOT FOUND — TRY ⌘K`), serif return-home link, and a small mono hint pointing at CmdK.

The splat route wiring and `500.tsx` route file from slice #14 are not touched — only the rendered view components change.

## Acceptance criteria

- [ ] `NotFoundView` renders serif `404`, mono dateline, return-home link, ⌘K hint
- [ ] `ServerErrorView` renders serif `500` with parallel structure
- [ ] Both use the dark palette
- [ ] `NotFoundView.test.tsx` and `ServerErrorView.test.tsx` updated for new structure
- [ ] Existing tests stay green

## Blocked by

- #18
- #20

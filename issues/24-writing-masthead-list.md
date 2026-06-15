# /writing: masthead + dated essay list (paper palette)

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild `WritingIndexView` on the paper palette (already wired by #19) as a publication front-matter: serif `WRITING` masthead with a mono subtitle/issue marker (e.g. `Essays on engineering and craft — Vol. 01`), then a dated rule-divided essay list — date in Berkeley Mono on the left, serif essay title, Söhne excerpt, year/issue marker on the right.

Each row wraps `ViewTransitionLink` and uses the retuned `HoverLift` for the rule-reveal hover. The empty state (zero published essays) renders deliberate publication copy — e.g. `Issue — in preparation` — instead of a blank list, honoring PRD user story 16. All colors resolve to paper-palette tokens.

## Acceptance criteria

- [ ] `WritingIndexView` rebuilt with serif `WRITING` masthead + mono subtitle
- [ ] Dated rule-divided essay list: date (mono) + serif title + Söhne excerpt + year/issue
- [ ] Zero-essay empty state renders deliberate publication copy, not a blank list
- [ ] Each row wraps `ViewTransitionLink` and uses retuned `HoverLift`
- [ ] All colors resolve to paper-palette tokens
- [ ] `WritingIndexView.test.tsx` updated: masthead, list rows, empty state
- [ ] Existing tests stay green

## Blocked by

- #18
- #19
- #20

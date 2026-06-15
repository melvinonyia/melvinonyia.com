# /writing/$slug: essay reading view (paper palette)

## Parent

PRD: `prd/prd-site-redesign.md`

## What to build

Rebuild `WritingPostView` on paper as a magazine-grade reading surface. Top region: essay index (`No. 03` in mono) + serif title + mono dateline (`DATE — READ TIME — TOPIC`). Body in Söhne at ~18–20px with ~68ch measure and line-height ~1.6, single column. No drop cap. No hero image.

Pull-quotes render in the display serif and asides in Berkeley Mono — wire these as MDX components that contributors can use inside `.mdx` files. The MDX content pipeline and `<Demo />` islands continue to render inside the new body layout unchanged.

## Acceptance criteria

- [ ] `WritingPostView` top region renders essay index + serif title + mono dateline
- [ ] Body uses Söhne at ~18–20px, ~68ch measure, line-height ~1.6, single column
- [ ] Pull-quote MDX component renders in display serif; aside MDX component renders in mono
- [ ] No drop cap; no hero image
- [ ] `<Demo />` islands continue to render inside the new body layout
- [ ] `WritingPostView.test.tsx` updated for new top region + body structure + MDX component coverage
- [ ] Existing tests stay green

## Blocked by

- #24

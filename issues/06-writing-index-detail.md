# Writing index + detail + empty state

## What to build

Mirror the case-study content-collection pattern for essays at `content/writing/*.mdx`, and ship the routes `/writing` and `/writing/$slug`. The index lists essays reverse-chronologically with title, date, and a short blurb. When the essay collection is empty, `/writing` renders a deliberate, on-brand empty state ("writing soon — follow on [link]") rather than a blank list. The detail route uses the same loader pattern as `/work/$slug`.

## Acceptance criteria

- [ ] `content/writing/*.mdx` compiles via the same content pipeline as `/work`
- [ ] `/writing` SSRs the reverse-chronological list of essays
- [ ] `/writing` renders a designed empty state when the essay collection is empty
- [ ] `/writing/$slug` SSRs the matching essay; unknown slug renders a not-found state
- [ ] Tests cover: collection parsing for the writing kind, route loader for detail, and the empty-state branch of the index
- [ ] At least one fixture essay is committed and visible at `/writing` and `/writing/its-slug`

## Blocked by

- #4 (MDX content collection + /work)

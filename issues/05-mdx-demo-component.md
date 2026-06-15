# `<Demo />` MDX island wrapper

## What to build

A single MDX-available `<Demo />` component that wraps any per-post interactive React island, lazy-loads the inner component with `React.lazy`, and only mounts it when the wrapper scrolls into the viewport (IntersectionObserver). Until then, a styled placeholder (height-reserved, captioned) holds the layout to prevent layout shift.

The wrapper is the only sanctioned pattern for embedding interactivity in long-form content. Every interactive demo a case study or essay wants to embed flows through `<Demo />`. Update one fixture case study from slice #4 to include a `<Demo />` with a trivial inner component (e.g. a button that increments a counter) to prove the pattern end-to-end.

## Acceptance criteria

- [ ] `<Demo />` accepts a `load` (or `import`) prop returning a dynamic-imported React module
- [ ] Placeholder reserves the expected height (passed as prop) so first paint of prose is stable
- [ ] Inner component is mounted only after the wrapper enters the viewport (IntersectionObserver)
- [ ] Fallback rendering for SSR (no IntersectionObserver) does not break the page
- [ ] A fixture case study embeds `<Demo />` with a trivial inner component; the page renders and the demo works after scroll
- [ ] RTL test asserts the placeholder renders before the inner module mounts
- [ ] No layout shift in a Lighthouse run on the case-study page

## Blocked by

- #4 (MDX content collection + /work)

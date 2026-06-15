# Nav + footer + About page

## What to build

Implement the persistent header navigation and footer that appear across every route, plus the `/about` page. The header carries links to Home, Work, Writing, About, Contact and a Cmd-K hint (visual only at this stage — the palette ships in a later slice). The footer carries social links (GitHub, LinkedIn, X), a copyright line, and a small legal anchor. The About page renders a short bio, the same social links cluster, and a Contact CTA.

Navigation uses plain `<a>` / TanStack `<Link>` for now — magnetic behavior arrives in a later slice. Active-route indication is keyboard-and-screen-reader friendly.

## Acceptance criteria

- [ ] Header component rendered on every route with nav items: Home / Work / Writing / About / Contact
- [ ] Header shows a visual "⌘K" hint (non-interactive)
- [ ] Footer rendered on every route with GitHub / LinkedIn / X icons, copyright, and a legal link stub
- [ ] `/about` SSRs a short bio, social cluster, and a contact CTA linking to `/contact`
- [ ] Active nav link has both a visual indicator and `aria-current="page"`
- [ ] Keyboard tab order through nav and footer is sensible; focus rings visible
- [ ] Head snapshot test for `/about`

## Blocked by

- #1 (Bootstrap)

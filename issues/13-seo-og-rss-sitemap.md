# SEO head + sitemap + robots + RSS + static OG images

## What to build

Cover the whole metadata + discoverability surface in one pass:

- Per-route `<head>` metadata via TanStack Start's head management: `<title>`, `<meta name="description">`, canonical link, OG title/description/image, Twitter card tags.
- `sitemap.xml` and `robots.txt` generated at build time from the route list and content collection.
- `rss.xml` generated at build time from the writing collection.
- Hand-designed static OG images committed to `/public/og/`: one per major page (home, work, writing, about, contact) and one default for case-study and essay detail routes when no per-post image is specified.

This slice is **HITL**: the OG images require a design pass in Figma before they can be committed.

## Acceptance criteria

- [ ] Every route SSRs a correct `<title>`, `<meta name="description">`, canonical link
- [ ] Every route SSRs OG title, OG description, OG image, OG type, and Twitter card tags
- [ ] `sitemap.xml` generated at build time and served from `/sitemap.xml`
- [ ] `robots.txt` generated and served from `/robots.txt`
- [ ] `rss.xml` generated from the writing collection and served from `/rss.xml`
- [ ] Static OG PNGs designed in Figma and committed to `/public/og/` for: home, work, writing, about, contact, default-case-study, default-essay
- [ ] Per-route head snapshot test asserts the full metadata block
- [ ] Sitemap and RSS exercised by unit tests against fixture collections
- [ ] Manual verification: home URL pasted into a Twitter/Slack/LinkedIn unfurl previewer renders the intended OG card

## Blocked by

- #2 (Home hero)
- #4 (MDX content collection + /work)
- #6 (Writing index + detail)

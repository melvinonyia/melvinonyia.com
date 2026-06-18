# Post images

Drop images for a post under `public/images/<post-slug>/` and reference
them root-relative. Slug = the MDX filename without extension
(e.g. `movement-fingerprint.mdx` → `movement-fingerprint/`).

- **Lead image** — set in frontmatter via `leadImage` (same field for work
  and writing posts):
  ```yaml
  leadImage: /images/spec-driven-agent-swarm/lead.png
  ```
  Rendered full-width in the text column (max ~672px wide) and locked to
  **16:9** with `object-fit: cover` — anything off-ratio gets cropped, not
  letterboxed. Export a **1600×900** source (clean 16:9, ~2.4× the display
  slot so it stays crisp on retina). Author the crop yourself.
- **Inline body images** — standard markdown syntax inside the MDX:
  ```markdown
  ![alt text](/images/movement-fingerprint/diagram.png)
  ```

## Social-share cards (OG)

- `public/og/` — social cards, **1200×630** (1.91:1). Per-post cards are
  named after the slug, e.g. `og/work-movement-fingerprint.png`. Opt in per
  post via frontmatter:
  ```yaml
  ogImage: /og/work-spec-driven-agent-swarm.png
  ```
  Resolution order (both fall back to a generic card):
  - Work: `ogImage > leadImage > /og/work.png` (`src/lib/seo/caseStudyPageHead.ts`)
  - Writing: `ogImage > leadImage > /og/writing.png` (`src/lib/seo/piecePageHead.ts`)

## Other image slots

- `public/images/error-500.svg` — illustration for the 500 view. Not yet
  committed; drop the artwork here and it renders automatically. The 404
  view is text-only.

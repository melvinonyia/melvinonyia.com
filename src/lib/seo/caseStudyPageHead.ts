import { SITE_NAME, SITE_URL } from './homeHead'
import type { CaseStudySummary } from '~/lib/content/work'

const DEFAULT_OG_IMAGE = `${SITE_URL}/og/work.png`

export function caseStudyPageHead(c: CaseStudySummary) {
  const url = `${SITE_URL}/work/${c.slug}`
  const title = `${c.title} — ${SITE_NAME}`
  const description = c.dek || `${c.title}. A case study by ${SITE_NAME}.`
  const ogPath = c.ogImage ?? c.leadImage
  const image = ogPath ? `${SITE_URL}${ogPath}` : DEFAULT_OG_IMAGE

  return {
    meta: [
      { title },
      { name: 'description', content: description },

      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'article:published_time', content: c.published },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

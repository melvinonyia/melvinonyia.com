import { SITE_NAME, SITE_URL } from './homeHead'
import type { EssaySummary } from '~/lib/content/writing'

const DEFAULT_OG_IMAGE = `${SITE_URL}/og/writing.png`

export function writingPostHead(essay: EssaySummary) {
  const url = `${SITE_URL}/writing/${essay.slug}`
  const title = `${essay.title} — ${SITE_NAME}`
  const description = essay.excerpt || `${essay.title}. An essay by ${SITE_NAME}.`
  const ogPath = essay.ogImage ?? essay.coverImage
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
      { property: 'article:published_time', content: essay.date },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

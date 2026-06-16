import { SITE_NAME, SITE_URL } from './homeHead'
import type { WorkPostSummary } from '~/lib/content/work'

const DEFAULT_OG_IMAGE = `${SITE_URL}/og/work.png`

export function workPostHead(post: WorkPostSummary) {
  const url = `${SITE_URL}/work/${post.slug}`
  const title = `${post.title} — ${SITE_NAME}`
  const description =
    post.excerpt || `${post.title}. A case study by ${SITE_NAME}.`
  const ogPath = post.ogImage ?? post.heroImage
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
      { property: 'article:published_time', content: post.date },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    links: [{ rel: 'canonical', href: url }],
  }
}

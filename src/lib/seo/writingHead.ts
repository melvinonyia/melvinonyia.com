import { SITE_NAME, SITE_URL } from './homeHead'

const TITLE = `Writing — ${SITE_NAME}`
const DESCRIPTION =
  'Articles and notes from Melvin Onyia on software engineering — build things, solve problems.'
const OG_IMAGE = `${SITE_URL}/og/writing.png`
const WRITING_URL = `${SITE_URL}/writing`

export function writingHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },

      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: WRITING_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: WRITING_URL }],
  }
}

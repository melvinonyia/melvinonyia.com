import { SITE_NAME, SITE_URL } from './homeHead'

const TITLE = `Legal — ${SITE_NAME}`
const DESCRIPTION = 'Legal notices, attribution, and footer fine print for melvinonyia.com.'
const OG_IMAGE = `${SITE_URL}/og/default.png`
const LEGAL_URL = `${SITE_URL}/legal`

export function legalHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },

      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: LEGAL_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },

      { name: 'robots', content: 'noindex' },
    ],
    links: [{ rel: 'canonical', href: LEGAL_URL }],
  }
}

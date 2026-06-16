import { SITE_NAME, SITE_URL } from './homeHead'

const TITLE = `Terms — ${SITE_NAME}`
const DESCRIPTION = 'Terms of use for melvinonyia.com — content licensing and acceptable use.'
const OG_IMAGE = `${SITE_URL}/og/default.png`
const TERMS_URL = `${SITE_URL}/terms`

export function termsHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },

      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: TERMS_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },

      { name: 'robots', content: 'noindex' },
    ],
    links: [{ rel: 'canonical', href: TERMS_URL }],
  }
}

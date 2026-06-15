import { SITE_NAME, SITE_URL } from './homeHead'

const TITLE = `Contact — ${SITE_NAME}`
const DESCRIPTION =
  'Get in touch with Melvin Onyia. Direct line for new projects, collaboration, or a hello.'
const OG_IMAGE = `${SITE_URL}/og/contact.png`
const CONTACT_URL = `${SITE_URL}/contact`

export function contactHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },

      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: CONTACT_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: CONTACT_URL }],
  }
}

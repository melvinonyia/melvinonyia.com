import { SITE_NAME, SITE_URL } from './homeHead'

const TITLE = `About — ${SITE_NAME}`
const DESCRIPTION =
  'About Melvin Onyia — software engineer driven and inspired by simple & scalable technical design across publishing, foodservice, and healthcare.'
const OG_IMAGE = `${SITE_URL}/og/about.png`
const ABOUT_URL = `${SITE_URL}/about`

export function aboutHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },

      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'profile' },
      { property: 'og:url', content: ABOUT_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: ABOUT_URL }],
  }
}

export const SITE_URL = 'https://melvinonyia.com'
export const SITE_NAME = 'Melvin Onyia'

const TITLE = 'Melvin Onyia — Staff Software Engineer'
const DESCRIPTION =
  'Staff software engineer building software at the intersection of biomechanics and engineering.'
const OG_IMAGE = `${SITE_URL}/og/home.png`
const HOME_URL = `${SITE_URL}/`

export function homeHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },

      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: HOME_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: HOME_URL }],
  }
}

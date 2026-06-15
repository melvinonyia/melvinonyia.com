import { SITE_NAME, SITE_URL } from './homeHead'

const TITLE = `Work — ${SITE_NAME}`
const DESCRIPTION =
  'Selected work from Melvin Onyia — software engineering across publishing, foodservice, and healthcare.'
const OG_IMAGE = `${SITE_URL}/og/work.png`
const WORK_URL = `${SITE_URL}/work`

export function workHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },

      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: WORK_URL },
      { property: 'og:image', content: OG_IMAGE },
      { property: 'og:site_name', content: SITE_NAME },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
      { name: 'twitter:image', content: OG_IMAGE },
    ],
    links: [{ rel: 'canonical', href: WORK_URL }],
  }
}

import { SITE_NAME } from './homeHead'

const TITLE = `Page not found — ${SITE_NAME}`
const DESCRIPTION = 'The page you asked for is not on melvinonyia.com.'

export function notFoundHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { name: 'robots', content: 'noindex' },
    ],
  }
}

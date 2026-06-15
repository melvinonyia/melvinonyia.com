import { SITE_NAME } from './homeHead'

const TITLE = `Server error — ${SITE_NAME}`
const DESCRIPTION = 'The server hit an error finishing this request.'

export function serverErrorHead() {
  return {
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { name: 'robots', content: 'noindex' },
    ],
  }
}

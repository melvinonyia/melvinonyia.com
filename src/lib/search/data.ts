import { getEssaySummaries } from '~/lib/content/writing'
import { getWorkPostSummaries } from '~/lib/content/work'
import { CONTACT_EMAIL, SOCIAL_LINKS } from '~/lib/site/socials'
import {
  buildSearchIndex,
  type SearchEntry,
  type StaticEntryInput,
} from './indexer'

const STATIC_ENTRIES: StaticEntryInput = {
  routes: [
    { id: 'route:home', title: 'Home', to: '/' },
    { id: 'route:work', title: 'Work', to: '/work' },
    { id: 'route:writing', title: 'Writing', to: '/writing' },
    { id: 'route:about', title: 'About', to: '/about' },
    { id: 'route:contact', title: 'Contact', to: '/contact' },
  ],
  externals: SOCIAL_LINKS.map((s) => ({
    id: `ext:${s.key}`,
    title: s.label,
    href: s.href,
    hint: 'External link',
  })),
  mailto: {
    id: 'mailto:contact',
    title: `Email ${CONTACT_EMAIL}`,
    href: `mailto:${CONTACT_EMAIL}`,
    hint: 'Compose email',
  },
}

let cached: SearchEntry[] | null = null

export function getSearchEntries(): SearchEntry[] {
  if (cached) return cached
  cached = buildSearchIndex({
    work: getWorkPostSummaries(),
    essays: getEssaySummaries(),
    staticEntries: STATIC_ENTRIES,
  })
  return cached
}

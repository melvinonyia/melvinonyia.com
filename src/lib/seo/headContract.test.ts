import { describe, it, expect } from 'vitest'
import { homeHead } from './homeHead'
import { aboutHead } from './aboutHead'
import { contactHead } from './contactHead'
import { legalHead } from './legalHead'
import { workHead } from './workHead'
import { writingHead } from './writingHead'

type HeadMeta = Array<Record<string, unknown>>
type HeadLink = Array<Record<string, unknown>>
interface Head {
  meta: HeadMeta
  links?: HeadLink
}

const REGISTRY: Array<{ name: string; head: () => Head; canonical: string }> = [
  { name: 'home', head: homeHead, canonical: 'https://melvinonyia.com/' },
  { name: 'about', head: aboutHead, canonical: 'https://melvinonyia.com/about' },
  { name: 'contact', head: contactHead, canonical: 'https://melvinonyia.com/contact' },
  { name: 'legal', head: legalHead, canonical: 'https://melvinonyia.com/legal' },
  { name: 'work', head: workHead, canonical: 'https://melvinonyia.com/work' },
  { name: 'writing', head: writingHead, canonical: 'https://melvinonyia.com/writing' },
]

function findMeta(meta: HeadMeta, predicate: (m: Record<string, unknown>) => boolean) {
  return meta.find(predicate)
}

describe('per-route head contract', () => {
  for (const route of REGISTRY) {
    describe(route.name, () => {
      const head = route.head()

      it('declares a non-empty <title>', () => {
        const titleEntry = findMeta(head.meta, (m) => 'title' in m)
        expect(titleEntry).toBeDefined()
        expect(typeof titleEntry?.title).toBe('string')
        expect((titleEntry!.title as string).length).toBeGreaterThan(0)
      })

      it('declares a description', () => {
        const desc = findMeta(head.meta, (m) => m.name === 'description')
        expect(desc).toBeDefined()
        expect(typeof desc?.content).toBe('string')
        expect((desc!.content as string).length).toBeGreaterThan(10)
      })

      it('declares a canonical <link>', () => {
        expect(head.links).toContainEqual({ rel: 'canonical', href: route.canonical })
      })

      it.each([
        'og:title',
        'og:description',
        'og:type',
        'og:url',
        'og:image',
        'og:site_name',
      ])('declares %s', (property) => {
        const entry = findMeta(head.meta, (m) => m.property === property)
        expect(entry, `missing ${property} for ${route.name}`).toBeDefined()
        expect(typeof entry!.content).toBe('string')
        expect((entry!.content as string).length).toBeGreaterThan(0)
      })

      it.each([
        ['twitter:card', 'summary_large_image'],
        ['twitter:title', null],
        ['twitter:description', null],
        ['twitter:image', null],
      ])('declares %s', (name, expectedContent) => {
        const entry = findMeta(head.meta, (m) => m.name === name)
        expect(entry, `missing ${name} for ${route.name}`).toBeDefined()
        if (expectedContent) {
          expect(entry?.content).toBe(expectedContent)
        } else {
          expect(typeof entry?.content).toBe('string')
        }
      })
    })
  }
})

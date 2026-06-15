import { describe, it, expect } from 'vitest'
import { homeHead, SITE_URL } from './homeHead'

interface MetaTitle { title: string }
interface MetaName { name: string; content: string }
interface MetaProperty { property: string; content: string }
type Meta = MetaTitle | MetaName | MetaProperty | Record<string, unknown>

function findByTitle(meta: Meta[]): string | undefined {
  for (const m of meta) {
    if (typeof (m as MetaTitle).title === 'string') return (m as MetaTitle).title
  }
  return undefined
}

function findByName(meta: Meta[], name: string): string | undefined {
  return (meta.find((m) => (m as MetaName).name === name) as MetaName | undefined)?.content
}

function findByProperty(meta: Meta[], property: string): string | undefined {
  return (meta.find((m) => (m as MetaProperty).property === property) as MetaProperty | undefined)
    ?.content
}

describe('homeHead', () => {
  const head = homeHead()

  it('declares title and description', () => {
    expect(findByTitle(head.meta)).toBe('Melvin Onyia — Software Engineer')
    expect(findByName(head.meta, 'description')).toMatch(/Build things, solve problems/)
  })

  it('declares a canonical link to the home URL', () => {
    const canonical = head.links.find((l) => l.rel === 'canonical')
    expect(canonical?.href).toBe(`${SITE_URL}/`)
  })

  it('declares the full Open Graph cluster', () => {
    expect(findByProperty(head.meta, 'og:title')).toBe('Melvin Onyia — Software Engineer')
    expect(findByProperty(head.meta, 'og:description')).toMatch(/Build things, solve problems/)
    expect(findByProperty(head.meta, 'og:type')).toBe('website')
    expect(findByProperty(head.meta, 'og:url')).toBe(`${SITE_URL}/`)
    expect(findByProperty(head.meta, 'og:image')).toBe(`${SITE_URL}/og/home.png`)
    expect(findByProperty(head.meta, 'og:site_name')).toBe('Melvin Onyia')
  })

  it('declares the Twitter card cluster', () => {
    expect(findByName(head.meta, 'twitter:card')).toBe('summary_large_image')
    expect(findByName(head.meta, 'twitter:title')).toBe('Melvin Onyia — Software Engineer')
    expect(findByName(head.meta, 'twitter:description')).toMatch(/Build things, solve problems/)
    expect(findByName(head.meta, 'twitter:image')).toBe(`${SITE_URL}/og/home.png`)
  })
})

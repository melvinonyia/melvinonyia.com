import { describe, it, expect } from 'vitest'
import { buildSitemap } from './sitemap'

describe('buildSitemap', () => {
  it('emits a well-formed urlset declaration', () => {
    const xml = buildSitemap([{ loc: 'https://example.com/' }])
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain(
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    )
    expect(xml.trim().endsWith('</urlset>')).toBe(true)
  })

  it('emits one <url> per entry with a <loc>', () => {
    const xml = buildSitemap([
      { loc: 'https://example.com/' },
      { loc: 'https://example.com/about' },
      { loc: 'https://example.com/work/foo' },
    ])
    const urlCount = (xml.match(/<url>/g) ?? []).length
    expect(urlCount).toBe(3)
    expect(xml).toContain('<loc>https://example.com/</loc>')
    expect(xml).toContain('<loc>https://example.com/about</loc>')
    expect(xml).toContain('<loc>https://example.com/work/foo</loc>')
  })

  it('emits <lastmod> only when provided', () => {
    const xml = buildSitemap([
      { loc: 'https://example.com/', lastmod: '2025-11-12' },
      { loc: 'https://example.com/about' },
    ])
    expect(xml).toContain('<lastmod>2025-11-12</lastmod>')
    const lastmodCount = (xml.match(/<lastmod>/g) ?? []).length
    expect(lastmodCount).toBe(1)
  })

  it('escapes XML-special characters in loc', () => {
    const xml = buildSitemap([
      { loc: 'https://example.com/search?q=a&b=c' },
    ])
    expect(xml).toContain('?q=a&amp;b=c')
    expect(xml).not.toContain('?q=a&b=c<')
  })
})

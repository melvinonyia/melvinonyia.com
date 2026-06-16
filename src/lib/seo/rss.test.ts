import { describe, it, expect } from 'vitest'
import { buildRss } from './rss'

const CHANNEL = {
  siteUrl: 'https://example.com',
  feedUrl: 'https://example.com/rss.xml',
  title: 'Example Writing',
  description: 'Pieces from example.com',
}

describe('buildRss', () => {
  it('emits a well-formed RSS 2.0 declaration with channel metadata', () => {
    const xml = buildRss(CHANNEL, [])
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true)
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<title>Example Writing</title>')
    expect(xml).toContain('<link>https://example.com</link>')
    expect(xml).toContain(
      '<atom:link href="https://example.com/rss.xml" rel="self" type="application/rss+xml" />',
    )
    expect(xml.trim().endsWith('</rss>')).toBe(true)
  })

  it('emits one <item> per entry with title, link, guid, pubDate', () => {
    const xml = buildRss(CHANNEL, [
      {
        title: 'First piece',
        link: 'https://example.com/writing/first',
        published: '2025-11-12',
        dek: 'A short summary.',
      },
      {
        title: 'Second piece',
        link: 'https://example.com/writing/second',
        published: '2025-08-04',
      },
    ])
    const itemCount = (xml.match(/<item>/g) ?? []).length
    expect(itemCount).toBe(2)
    expect(xml).toContain('<title>First piece</title>')
    expect(xml).toContain('<link>https://example.com/writing/first</link>')
    expect(xml).toContain(
      '<guid isPermaLink="true">https://example.com/writing/first</guid>',
    )
    expect(xml).toContain('<description>A short summary.</description>')
  })

  it('omits <description> when no dek is provided', () => {
    const xml = buildRss(CHANNEL, [
      { title: 'No dek', link: 'https://example.com/x', published: '2025-01-01' },
    ])
    expect(xml).not.toContain('<description>No dek</description>')
  })

  it('escapes XML-special characters in fields', () => {
    const xml = buildRss(CHANNEL, [
      {
        title: 'Bones & joints',
        link: 'https://example.com/bones?q=a&b=c',
        published: '2025-01-01',
        dek: 'About <em>bones</em>',
      },
    ])
    expect(xml).toContain('Bones &amp; joints')
    expect(xml).toContain('?q=a&amp;b=c')
    expect(xml).toContain('&lt;em&gt;bones&lt;/em&gt;')
  })

  it('formats pubDate as RFC 822-compatible UTC', () => {
    const xml = buildRss(CHANNEL, [
      { title: 'X', link: 'https://example.com/x', published: '2025-11-12' },
    ])
    expect(xml).toMatch(/<pubDate>[A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} 2025 .*GMT<\/pubDate>/)
  })

  it('lastBuildDate is the published date of the most recent entry', () => {
    const xml = buildRss(CHANNEL, [
      { title: 'Newer', link: 'https://example.com/a', published: '2025-11-12' },
      { title: 'Older', link: 'https://example.com/b', published: '2025-08-04' },
    ])
    expect(xml).toMatch(/<lastBuildDate>.*2025.*<\/lastBuildDate>/)
    expect(xml).toMatch(/<lastBuildDate>.*Nov.*<\/lastBuildDate>/)
  })
})

import { describe, it, expect } from 'vitest'
import { piecePageHead } from './piecePageHead'
import type { PieceSummary } from '~/lib/content/writing'

function makePiece(overrides: Partial<PieceSummary> = {}): PieceSummary {
  return {
    slug: 'the-leg-between-lab-and-field',
    title: 'The leg between lab and field',
    published: '2025-10-08',
    dek: 'A short dek.',
    tags: ['notes'],
    ogImage: null,
    ...overrides,
  }
}

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('piecePageHead', () => {
  it('builds title from piece title and site name', () => {
    const head = piecePageHead(makePiece())
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe(
      'The leg between lab and field — Melvin Onyia',
    )
  })

  it('uses dek as description when present', () => {
    const head = piecePageHead(makePiece({ dek: 'Custom dek here.' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toBe(
      'Custom dek here.',
    )
  })

  it('falls back to a derived description when dek is empty', () => {
    const head = piecePageHead(makePiece({ dek: '' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /The leg between lab and field\. A piece by Melvin Onyia\./,
    )
  })

  it('sets og:type to article and includes published_time', () => {
    const head = piecePageHead(makePiece())
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('article')
    expect(
      findMeta(head.meta, (m) => m.property === 'article:published_time')?.content,
    ).toBe('2025-10-08')
  })

  it('resolves og:image as ogImage > leadImage > default', () => {
    expect(
      findMeta(piecePageHead(makePiece()).meta, (m) => m.property === 'og:image')?.content,
    ).toBe('https://melvinonyia.com/og/writing.png')

    expect(
      findMeta(
        piecePageHead(makePiece({ leadImage: '/images/the-leg-between-lab-and-field/lead.jpg' })).meta,
        (m) => m.property === 'og:image',
      )?.content,
    ).toBe('https://melvinonyia.com/images/the-leg-between-lab-and-field/lead.jpg')

    expect(
      findMeta(
        piecePageHead(
          makePiece({
            leadImage: '/images/the-leg-between-lab-and-field/lead.jpg',
            ogImage: '/og/writing-the-leg-between-lab-and-field.png',
          }),
        ).meta,
        (m) => m.property === 'og:image',
      )?.content,
    ).toBe('https://melvinonyia.com/og/writing-the-leg-between-lab-and-field.png')
  })

  it('sets canonical to the piece URL', () => {
    const head = piecePageHead(makePiece())
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/writing/the-leg-between-lab-and-field',
    })
  })
})

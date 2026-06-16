import { describe, it, expect } from 'vitest'
import {
  getPieces,
  getPiece,
  getPieceSummaries,
  resolvePiece,
  PieceNotFoundError,
} from './writing'

describe('writing content collection', () => {
  it('parses frontmatter into a typed list of pieces', () => {
    const pieces = getPieces()
    expect(pieces.length).toBeGreaterThanOrEqual(1)

    const fixture = pieces.find((p) => p.slug === 'the-leg-between-lab-and-field')
    expect(fixture).toBeDefined()
    expect(fixture!.title).toBe('The leg between lab and field')
    expect(fixture!.published).toBe('2025-10-08')
    expect(fixture!.tags).toEqual(expect.arrayContaining(['notes', 'biomechanics']))
    expect(typeof fixture!.Body).toBe('function')
  })

  it('derives slug from the source filename', () => {
    const slugs = getPieces().map((p) => p.slug)
    expect(slugs).toContain('the-leg-between-lab-and-field')
  })

  it('sorts pieces reverse-chronologically by published date', () => {
    const dates = getPieces().map((p) => p.published)
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
    expect(dates).toEqual(sorted)
  })

  it('exposes dek from frontmatter when present', () => {
    const piece = getPiece('the-leg-between-lab-and-field')
    expect(piece).not.toBeNull()
    expect(piece!.dek).toMatch(/movement-science findings/)
  })

  it('getPiece returns null for unknown slugs', () => {
    expect(getPiece('does-not-exist')).toBeNull()
  })

  it('getPieceSummaries excludes the Body component for loader-safe payloads', () => {
    const summaries = getPieceSummaries()
    expect(summaries.length).toBeGreaterThan(0)
    summaries.forEach((s) => expect('Body' in s).toBe(false))
  })

  it('resolvePiece returns the piece for a known slug', () => {
    expect(resolvePiece('the-leg-between-lab-and-field').slug).toBe(
      'the-leg-between-lab-and-field',
    )
  })

  it('resolvePiece throws PieceNotFoundError for an unknown slug', () => {
    expect(() => resolvePiece('nope')).toThrow(PieceNotFoundError)
  })
})

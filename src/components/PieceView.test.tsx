import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PieceView } from './PieceView'
import type { Piece } from '~/lib/content/writing'

function makePiece(overrides: Partial<Piece> = {}): Piece {
  const Body: Piece['Body'] = () => <p>Body content from the MDX module.</p>
  return {
    slug: 'a-test-piece',
    title: 'A Test Piece',
    published: '2025-10-08',
    dek: 'A short dek.',
    tags: ['infrastructure', 'notes'],
    readTime: 4,
    ogImage: null,
    Body,
    ...overrides,
  }
}

describe('PieceView', () => {
  it('renders the piece title and dek as inline subtitle', () => {
    render(<PieceView piece={makePiece()} pieceNumber={1} />)
    expect(screen.getByText('A Test Piece')).toBeInTheDocument()
    expect(screen.getByText(/A short dek/)).toBeInTheDocument()
  })

  it('renders the MDX body content', () => {
    render(<PieceView piece={makePiece()} pieceNumber={1} />)
    expect(
      screen.getByText('Body content from the MDX module.'),
    ).toBeInTheDocument()
  })

  it('renders the primary tag as the uppercase category label', () => {
    const { container } = render(
      <PieceView piece={makePiece()} pieceNumber={1} />,
    )
    const category = container.querySelector('.detail-layout-category')
    expect(category).not.toBeNull()
    expect(category!.textContent).toBe('infrastructure')
  })

  it('renders the Last updated line with the formatted date', () => {
    const { container } = render(
      <PieceView piece={makePiece()} pieceNumber={1} />,
    )
    const updated = container.querySelector('.detail-layout-updated')
    expect(updated).not.toBeNull()
    expect(updated!.textContent).toMatch(/Last updated: October \d+, 2025/)
  })

  it('renders all tags as pills in the footer', () => {
    const { container } = render(
      <PieceView
        piece={makePiece({ tags: ['code', 'notes'] })}
        pieceNumber={1}
      />,
    )
    const tags = Array.from(
      container.querySelectorAll('.detail-layout-tag'),
    ).map((el) => el.textContent)
    expect(tags).toEqual(['code', 'notes'])
  })

  it('renders X + LinkedIn share links and a Copy link button', () => {
    render(<PieceView piece={makePiece()} pieceNumber={1} />)
    expect(screen.getByRole('link', { name: 'Share on X' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Share on LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy link' })).toBeInTheDocument()
  })

  it('renders the readtime line when the piece has readTime set', () => {
    render(<PieceView piece={makePiece({ readTime: 7 })} pieceNumber={1} />)
    expect(screen.getByText('7 min read')).toBeInTheDocument()
  })
})

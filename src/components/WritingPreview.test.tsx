import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { PieceSummary } from '~/lib/content/writing'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    params,
    children,
    ...rest
  }: {
    to: string
    params?: { slug?: string }
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = params?.slug ? to.replace('$slug', params.slug) : to
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  },
}))

import { WritingPreview } from './WritingPreview'

function makePiece(overrides: Partial<PieceSummary> = {}): PieceSummary {
  return {
    slug: 'a-test-piece',
    title: 'A Test Piece',
    published: '2025-10-08',
    dek: 'A short dek.',
    tags: ['movement-science'],
    readTime: 4,
    leadImage: null,
    ogImage: null,
    ...overrides,
  }
}

describe('WritingPreview', () => {
  it('renders nothing when there are no pieces', () => {
    const { container } = render(<WritingPreview pieces={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the Writing eyebrow and one Card per piece', () => {
    render(<WritingPreview pieces={[makePiece()]} />)
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('A Test Piece')).toBeInTheDocument()
    expect(screen.getByText('A short dek.')).toBeInTheDocument()
  })

  it('formats meta as "Category · YYYY · N min read"', () => {
    render(<WritingPreview pieces={[makePiece()]} />)
    expect(screen.getByText('Movement science · 2025 · 4 min read')).toBeInTheDocument()
  })

  it('drops the read-time segment when readTime is absent', () => {
    render(<WritingPreview pieces={[makePiece({ readTime: undefined })]} />)
    expect(screen.getByText('Movement science · 2025')).toBeInTheDocument()
  })

  it('uses the shared .card markup, not bespoke writing-preview cards', () => {
    const { container } = render(<WritingPreview pieces={[makePiece()]} />)
    expect(container.querySelector('.card')).not.toBeNull()
    expect(container.querySelector('.writing-preview__card')).toBeNull()
  })

  it('links the card to /writing/$slug', () => {
    render(<WritingPreview pieces={[makePiece()]} />)
    const card = screen.getByLabelText('A Test Piece')
    expect(card).toHaveAttribute('href', '/writing/a-test-piece')
  })

  it('renders the More writing CTA linking to /writing', () => {
    render(<WritingPreview pieces={[makePiece()]} />)
    const cta = screen.getByRole('link', { name: 'More writing' })
    expect(cta).toHaveAttribute('href', '/writing')
  })
})

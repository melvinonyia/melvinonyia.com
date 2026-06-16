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

import { WritingIndex } from './WritingIndex'

const PIECE: PieceSummary = {
  slug: 'a-test-piece',
  title: 'A Test Piece',
  published: '2025-10-08',
  dek: 'A short dek.',
  tags: ['code'],
  readTime: 4,
  leadImage: null,
  ogImage: null,
}

describe('WritingIndex', () => {
  it('renders the Writing header', () => {
    render(<WritingIndex pieces={[]} />)
    expect(screen.getByText('Writing')).toBeInTheDocument()
  })

  it('renders an empty-state message when there are no pieces', () => {
    render(<WritingIndex pieces={[]} />)
    expect(screen.getByText(/No pieces yet/)).toBeInTheDocument()
  })

  it('renders the card with title, dek, and uppercase meta', () => {
    render(<WritingIndex pieces={[PIECE]} />)
    expect(screen.getByText('A Test Piece')).toBeInTheDocument()
    expect(screen.getByText('A short dek.')).toBeInTheDocument()
    expect(screen.getByText('CODE')).toBeInTheDocument()
  })

  it('links the card to /writing/$slug', () => {
    render(<WritingIndex pieces={[PIECE]} />)
    const card = screen.getByLabelText('A Test Piece')
    expect(card).toHaveAttribute('href', '/writing/a-test-piece')
  })
})

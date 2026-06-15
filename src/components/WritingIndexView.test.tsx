import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { EssaySummary } from '~/lib/content/writing'

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

import { WritingIndexView } from './WritingIndexView'

const ESSAY: EssaySummary = {
  slug: 'a-test-essay',
  title: 'A Test Essay',
  date: '2025-10-08',
  excerpt: 'A short excerpt.',
  tags: ['code'],
  readTime: 4,
  coverImage: null,
}

describe('WritingIndexView', () => {
  it('renders the Blog header', () => {
    render(<WritingIndexView essays={[]} />)
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('renders an empty-state message when there are no essays', () => {
    render(<WritingIndexView essays={[]} />)
    expect(screen.getByText(/No essays yet/)).toBeInTheDocument()
  })

  it('renders the article card with title, subtitle, and uppercase meta', () => {
    render(<WritingIndexView essays={[ESSAY]} />)
    expect(screen.getByText('A Test Essay')).toBeInTheDocument()
    expect(screen.getByText('A short excerpt.')).toBeInTheDocument()
    expect(screen.getByText('CODE')).toBeInTheDocument()
  })

  it('links the card to /writing/$slug', () => {
    render(<WritingIndexView essays={[ESSAY]} />)
    const card = screen.getByLabelText('A Test Essay')
    expect(card).toHaveAttribute('href', '/writing/a-test-essay')
  })
})

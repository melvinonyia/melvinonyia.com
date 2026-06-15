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

import { RecentArticles } from './RecentArticles'

const ESSAY: EssaySummary = {
  slug: 'a-test-essay',
  title: 'A Test Essay',
  date: '2025-10-08',
  excerpt: 'A short excerpt.',
  tags: ['code'],
  readTime: 4,
  coverImage: null,
}

describe('RecentArticles', () => {
  it('renders nothing when there are no essays', () => {
    const { container } = render(<RecentArticles essays={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the Recent Articles section with title, subtitle, and uppercase meta', () => {
    render(<RecentArticles essays={[ESSAY]} />)
    expect(screen.getByText('Recent Articles')).toBeInTheDocument()
    expect(screen.getByText('A Test Essay')).toBeInTheDocument()
    expect(screen.getByText('A short excerpt.')).toBeInTheDocument()
    expect(screen.getByText('CODE')).toBeInTheDocument()
  })

  it('links the card to /writing/$slug', () => {
    render(<RecentArticles essays={[ESSAY]} />)
    const card = screen.getByLabelText('A Test Essay')
    expect(card).toHaveAttribute('href', '/writing/a-test-essay')
  })

  it('renders the More Articles CTA linking to /writing', () => {
    render(<RecentArticles essays={[ESSAY]} />)
    const cta = screen.getByRole('link', { name: 'More Articles' })
    expect(cta).toHaveAttribute('href', '/writing')
  })
})

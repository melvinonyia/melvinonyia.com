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

function makeEssay(overrides: Partial<EssaySummary> = {}): EssaySummary {
  return {
    slug: 'a-test-essay',
    title: 'A Test Essay',
    date: '2025-10-08',
    excerpt: 'A short excerpt.',
    tags: ['movement-science'],
    readTime: 4,
    coverImage: null,
    ogImage: null,
    ...overrides,
  }
}

describe('RecentArticles', () => {
  it('renders nothing when there are no essays', () => {
    const { container } = render(<RecentArticles essays={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the Writing eyebrow and one ArticleCard per essay', () => {
    render(<RecentArticles essays={[makeEssay()]} />)
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('A Test Essay')).toBeInTheDocument()
    expect(screen.getByText('A short excerpt.')).toBeInTheDocument()
  })

  it('formats meta as "Category · YYYY · N min read"', () => {
    render(<RecentArticles essays={[makeEssay()]} />)
    expect(screen.getByText('Movement science · 2025 · 4 min read')).toBeInTheDocument()
  })

  it('drops the read-time segment when readTime is absent', () => {
    render(<RecentArticles essays={[makeEssay({ readTime: undefined })]} />)
    expect(screen.getByText('Movement science · 2025')).toBeInTheDocument()
  })

  it('uses the shared .article-card markup, not bespoke writing-strip cards', () => {
    const { container } = render(<RecentArticles essays={[makeEssay()]} />)
    expect(container.querySelector('.article-card')).not.toBeNull()
    expect(container.querySelector('.writing-strip__card')).toBeNull()
  })

  it('links the card to /writing/$slug', () => {
    render(<RecentArticles essays={[makeEssay()]} />)
    const card = screen.getByLabelText('A Test Essay')
    expect(card).toHaveAttribute('href', '/writing/a-test-essay')
  })

  it('renders the More Articles CTA linking to /writing', () => {
    render(<RecentArticles essays={[makeEssay()]} />)
    const cta = screen.getByRole('link', { name: 'More Articles' })
    expect(cta).toHaveAttribute('href', '/writing')
  })
})

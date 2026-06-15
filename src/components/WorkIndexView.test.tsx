import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { WorkPostSummary } from '~/lib/content/work'

vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    params,
    children,
    ...rest
  }: {
    to: string
    params?: Record<string, string>
    children: React.ReactNode
  } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const href = params
      ? Object.entries(params).reduce(
          (acc, [k, v]) => acc.replace(`$${k}`, v),
          to,
        )
      : to
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  },
}))

import { WorkIndexView } from './WorkIndexView'

function makePost(overrides: Partial<WorkPostSummary>): WorkPostSummary {
  return {
    slug: 'placeholder',
    title: 'Placeholder',
    date: '2025-01-01',
    excerpt: '',
    tags: [],
    heroImage: null,
    ...overrides,
  }
}

describe('WorkIndexView', () => {
  it('renders each post with a title and a machine-readable date', () => {
    const posts = [
      makePost({ slug: 'a', title: 'Alpha post', date: '2025-11-12' }),
      makePost({ slug: 'b', title: 'Beta post', date: '2025-08-04' }),
    ]
    render(<WorkIndexView posts={posts} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Work' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Alpha post' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Beta post' })).toBeInTheDocument()
  })

  it('preserves the order it receives (reverse-chronological is upstream)', () => {
    const posts = [
      makePost({ slug: 'first', title: 'Newer', date: '2025-11-12' }),
      makePost({ slug: 'second', title: 'Older', date: '2025-08-04' }),
    ]
    render(<WorkIndexView posts={posts} />)
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(['Newer', 'Older'])
  })

  it('renders excerpts when present and omits the paragraph when empty', () => {
    const posts = [
      makePost({ slug: 'with', title: 'Has excerpt', excerpt: 'Visible excerpt.' }),
      makePost({ slug: 'without', title: 'No excerpt', excerpt: '' }),
    ]
    render(<WorkIndexView posts={posts} />)
    expect(screen.getByText('Visible excerpt.')).toBeInTheDocument()

    const withoutItem = screen
      .getByRole('heading', { level: 2, name: 'No excerpt' })
      .closest('article')!
    expect(within(withoutItem).queryAllByRole('paragraph')).toHaveLength(0)
    expect(within(withoutItem).queryByText('Visible excerpt.')).toBeNull()
  })

  it('links each post to its detail route', () => {
    render(
      <WorkIndexView
        posts={[makePost({ slug: 'movement-fingerprint', title: 'Movement fingerprint' })]}
      />,
    )
    const link = screen.getByRole('link', { name: /Movement fingerprint/ })
    expect(link).toHaveAttribute('href', '/work/movement-fingerprint')
  })
})

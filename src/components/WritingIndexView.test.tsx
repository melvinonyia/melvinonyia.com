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

import { WritingIndexView } from './WritingIndexView'

function makeEssay(overrides: Partial<EssaySummary>): EssaySummary {
  return {
    slug: 'placeholder',
    title: 'Placeholder essay',
    date: '2025-01-01',
    excerpt: '',
    tags: [],
    ...overrides,
  }
}

describe('WritingIndexView', () => {
  it('renders each essay with title, date, and link to its detail', () => {
    const essays = [
      makeEssay({ slug: 'a', title: 'Alpha', date: '2025-11-12' }),
      makeEssay({ slug: 'b', title: 'Beta', date: '2025-08-04' }),
    ]
    render(<WritingIndexView essays={essays} />)

    expect(screen.getByRole('heading', { level: 1, name: 'Writing' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Alpha/ })).toHaveAttribute(
      'href',
      '/writing/a',
    )
    expect(screen.getByRole('link', { name: /Beta/ })).toHaveAttribute(
      'href',
      '/writing/b',
    )
  })

  it('preserves the order it receives', () => {
    const essays = [
      makeEssay({ slug: 'first', title: 'Newer', date: '2025-11-12' }),
      makeEssay({ slug: 'second', title: 'Older', date: '2025-08-04' }),
    ]
    render(<WritingIndexView essays={essays} />)
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(headings).toEqual(['Newer', 'Older'])
  })

  it('renders excerpts when present', () => {
    render(
      <WritingIndexView
        essays={[makeEssay({ slug: 'a', title: 'With excerpt', excerpt: 'Visible.' })]}
      />,
    )
    expect(screen.getByText('Visible.')).toBeInTheDocument()
  })

  it('renders a designed empty state when there are no essays', () => {
    const { container } = render(<WritingIndexView essays={[]} />)
    const emptyState = container.querySelector('[data-empty-state]')
    expect(emptyState).not.toBeNull()
    expect(emptyState).toHaveTextContent(/Writing soon/i)
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('empty state links to X', () => {
    render(<WritingIndexView essays={[]} />)
    const xLink = screen.getByRole('link', { name: 'X' })
    expect(xLink).toHaveAttribute('href', 'https://x.com/melvinonyia')
  })
})

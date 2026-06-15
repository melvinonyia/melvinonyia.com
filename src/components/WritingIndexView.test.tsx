import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { EssaySummary } from '~/lib/content/writing'

const navigateMock = vi.fn()

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
  useNavigate: () => navigateMock,
}))

function installMatchMedia(matcher: (q: string) => boolean) {
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: matcher(query),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  )
}

beforeEach(() => {
  installMatchMedia(() => false)
  navigateMock.mockReset()
})

afterEach(() => {
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
})

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
  it('renders the serif WRITING masthead with a mono subtitle', () => {
    render(<WritingIndexView essays={[]} />)
    const h1 = screen.getByRole('heading', { level: 1, name: 'Writing' })
    expect(h1.className).toMatch(/font-serif/)
    expect(screen.getByText(/Essays on movement modeling/i)).toBeInTheDocument()
  })

  it('renders each essay with title, date, year, and link to its detail', () => {
    const essays = [
      makeEssay({ slug: 'a', title: 'Alpha', date: '2025-11-12' }),
      makeEssay({ slug: 'b', title: 'Beta', date: '2025-08-04' }),
    ]
    render(<WritingIndexView essays={essays} />)

    expect(screen.getByRole('link', { name: /Alpha/ })).toHaveAttribute('href', '/writing/a')
    expect(screen.getByRole('link', { name: /Beta/ })).toHaveAttribute('href', '/writing/b')
    // Date rendered (mono left column)
    expect(screen.getByText('Nov 2025')).toBeInTheDocument()
    expect(screen.getByText('Aug 2025')).toBeInTheDocument()
    // Year rendered (mono right column) — both essays from 2025
    const years = screen.getAllByText('2025')
    expect(years.length).toBeGreaterThanOrEqual(2)
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

  it('wraps each row in HoverLift for the rule-reveal hover', () => {
    const { container } = render(
      <WritingIndexView
        essays={[makeEssay({ slug: 'a', title: 'A' })]}
      />,
    )
    const lifts = container.querySelectorAll('[data-hover-lift]')
    expect(lifts.length).toBe(1)
    expect(lifts[0]!.querySelector('[data-hover-rule]')).not.toBeNull()
  })

  it('renders a designed empty state ("Issue — in preparation") when there are no essays', () => {
    const { container } = render(<WritingIndexView essays={[]} />)
    const emptyState = container.querySelector('[data-empty-state]')
    expect(emptyState).not.toBeNull()
    expect(emptyState).toHaveTextContent(/Issue — in preparation/i)
    expect(screen.queryByRole('list')).toBeNull()
  })

  it('empty state still links to X', () => {
    render(<WritingIndexView essays={[]} />)
    const xLink = screen.getByRole('link', { name: 'X' })
    expect(xLink).toHaveAttribute('href', 'https://x.com/melvinonyia')
  })
})

import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  useNavigate: () => vi.fn(),
}))

beforeEach(() => {
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  )
})

import { HomeFeatureSection } from './HomeFeatureSection'

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

describe('HomeFeatureSection', () => {
  it('renders a numbered editorial index of the work posts', () => {
    const posts = [
      makePost({ slug: 'alpha', title: 'Alpha', date: '2025-11-12' }),
      makePost({ slug: 'beta', title: 'Beta', date: '2024-08-04' }),
    ]
    const { container } = render(<HomeFeatureSection workPosts={posts} />)
    const list = container.querySelector('[data-work-cards]') as HTMLElement
    expect(list).not.toBeNull()
    expect(list.tagName).toBe('OL')
    const rows = within(list).getAllByRole('listitem')
    expect(rows).toHaveLength(2)
    const first = rows[0]!
    const second = rows[1]!
    expect(within(first).getByText('01')).toBeInTheDocument()
    expect(within(first).getByRole('heading', { level: 3 })).toHaveTextContent('Alpha')
    expect(within(first).getByText('2025')).toBeInTheDocument()
    expect(within(second).getByText('02')).toBeInTheDocument()
    expect(within(second).getByText('2024')).toBeInTheDocument()
  })

  it('wraps each row in a HoverLift and links it via the case-study path', () => {
    const posts = [makePost({ slug: 'alpha', title: 'Alpha' })]
    const { container } = render(<HomeFeatureSection workPosts={posts} />)
    const lifts = container.querySelectorAll('[data-hover-lift]')
    expect(lifts).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Alpha/ })).toHaveAttribute('href', '/work/alpha')
  })

  it('marks each row title with a stable view-transition target name', () => {
    const posts = [
      makePost({ slug: 'alpha', title: 'Alpha' }),
      makePost({ slug: 'beta', title: 'Beta' }),
    ]
    const { container } = render(<HomeFeatureSection workPosts={posts} />)
    const titles = container.querySelectorAll('[data-view-transition-name]')
    expect(titles).toHaveLength(2)
    expect(titles[0]!.getAttribute('data-view-transition-name')).toBe('work-title-alpha')
    expect(titles[1]!.getAttribute('data-view-transition-name')).toBe('work-title-beta')
  })

  it('renders an "All work →" link to the index', () => {
    render(<HomeFeatureSection workPosts={[]} />)
    expect(screen.getByRole('link', { name: /All work/ })).toHaveAttribute('href', '/work')
  })

  it('renders an empty index when no posts are passed (still readable layout)', () => {
    const { container } = render(<HomeFeatureSection workPosts={[]} />)
    const list = container.querySelector('[data-work-cards]') as HTMLElement
    expect(list).not.toBeNull()
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0)
  })

  it('no longer renders the latest-essay preview (dropped from home in the redesign)', () => {
    render(<HomeFeatureSection workPosts={[]} />)
    expect(screen.queryByText(/Latest essay/i)).toBeNull()
    expect(screen.queryByRole('link', { name: /All writing/ })).toBeNull()
  })
})

import { render, screen, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { WorkPostSummary } from '~/lib/content/work'
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

function makeEssay(overrides: Partial<EssaySummary>): EssaySummary {
  return {
    slug: 'placeholder-essay',
    title: 'Placeholder essay',
    date: '2025-01-01',
    excerpt: '',
    tags: [],
    ...overrides,
  }
}

describe('HomeFeatureSection', () => {
  it('renders the work posts it receives as cards linking to detail', () => {
    const posts = [
      makePost({ slug: 'a', title: 'Alpha', date: '2025-11-12' }),
      makePost({ slug: 'b', title: 'Beta', date: '2025-08-04' }),
    ]
    const { container } = render(
      <HomeFeatureSection workPosts={posts} latestEssay={null} />,
    )
    const cardList = container.querySelector('[data-work-cards]') as HTMLElement
    expect(cardList).not.toBeNull()
    expect(within(cardList).getAllByRole('link')).toHaveLength(2)
    expect(within(cardList).getByRole('link', { name: /Alpha/ })).toHaveAttribute(
      'href',
      '/work/a',
    )
    expect(within(cardList).getByRole('link', { name: /Beta/ })).toHaveAttribute(
      'href',
      '/work/b',
    )
  })

  it('renders an "All work →" link to the index', () => {
    render(<HomeFeatureSection workPosts={[]} latestEssay={null} />)
    expect(screen.getByRole('link', { name: /All work/ })).toHaveAttribute('href', '/work')
  })

  it('renders the latest-essay preview when an essay is provided', () => {
    render(
      <HomeFeatureSection
        workPosts={[]}
        latestEssay={makeEssay({
          slug: 'leg',
          title: 'The leg between lab and field',
          date: '2025-10-08',
        })}
      />,
    )
    expect(screen.getByText('Latest essay')).toBeInTheDocument()
    const essayLink = screen.getByRole('link', {
      name: /The leg between lab and field/,
    })
    expect(essayLink).toHaveAttribute('href', '/writing/leg')
    expect(screen.getByRole('link', { name: /All writing/ })).toHaveAttribute(
      'href',
      '/writing',
    )
  })

  it('omits the essay preview block gracefully when latestEssay is null', () => {
    render(<HomeFeatureSection workPosts={[]} latestEssay={null} />)
    expect(screen.queryByText('Latest essay')).toBeNull()
    expect(screen.queryByRole('link', { name: /All writing/ })).toBeNull()
  })

  it('wraps each card and the essay preview in a HoverLift', () => {
    const { container } = render(
      <HomeFeatureSection
        workPosts={[makePost({ slug: 'a', title: 'Alpha' })]}
        latestEssay={makeEssay({ slug: 'e', title: 'Essay' })}
      />,
    )
    const hovers = container.querySelectorAll('[data-hover-lift]')
    expect(hovers.length).toBe(2)
  })
})

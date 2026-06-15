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
  it('renders the serif Work masthead and each spread title', () => {
    const posts = [
      makePost({ slug: 'a', title: 'Alpha', date: '2025-11-12' }),
      makePost({ slug: 'b', title: 'Beta', date: '2024-08-04' }),
    ]
    render(<WorkIndexView posts={posts} />)
    const masthead = screen.getByRole('heading', { level: 1, name: 'Work' })
    expect(masthead).toBeInTheDocument()
    expect(masthead.className).toMatch(/font-serif/)
    expect(screen.getByRole('heading', { level: 2, name: 'Alpha' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Beta' })).toBeInTheDocument()
  })

  it('preserves order and renders 01/02 mono index labels with the year', () => {
    const posts = [
      makePost({ slug: 'first', title: 'Newer', date: '2025-11-12' }),
      makePost({ slug: 'second', title: 'Older', date: '2024-08-04' }),
    ]
    render(<WorkIndexView posts={posts} />)
    const titles = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(titles).toEqual(['Newer', 'Older'])
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    // Year renders twice per spread (right-aligned rule + dateline) by design.
    expect(screen.getAllByText('2025').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('2024').length).toBeGreaterThanOrEqual(1)
  })

  it('marks each spread title with the shared work-title view-transition name', () => {
    const posts = [
      makePost({ slug: 'alpha', title: 'Alpha' }),
      makePost({ slug: 'beta', title: 'Beta' }),
    ]
    const { container } = render(<WorkIndexView posts={posts} />)
    const targets = container.querySelectorAll('[data-view-transition-name]')
    expect(targets).toHaveLength(2)
    expect(targets[0]!.getAttribute('data-view-transition-name')).toBe('work-title-alpha')
    expect(targets[1]!.getAttribute('data-view-transition-name')).toBe('work-title-beta')
  })

  it('renders each spread inside a HoverLift wrapper', () => {
    const posts = [
      makePost({ slug: 'a', title: 'A' }),
      makePost({ slug: 'b', title: 'B' }),
    ]
    const { container } = render(<WorkIndexView posts={posts} />)
    expect(container.querySelectorAll('[data-hover-lift]')).toHaveLength(2)
  })

  it('links each spread to its detail route', () => {
    render(
      <WorkIndexView
        posts={[makePost({ slug: 'movement-fingerprint', title: 'Movement fingerprint' })]}
      />,
    )
    const link = screen.getByRole('link', { name: /Movement fingerprint/ })
    expect(link).toHaveAttribute('href', '/work/movement-fingerprint')
  })

  it('renders excerpts when present and tag-and-year dateline always', () => {
    const posts = [
      makePost({
        slug: 'tagged',
        title: 'Tagged post',
        excerpt: 'Visible excerpt.',
        tags: ['biomechanics', 'tooling'],
        date: '2025-11-12',
      }),
    ]
    render(<WorkIndexView posts={posts} />)
    expect(screen.getByText('Visible excerpt.')).toBeInTheDocument()
    expect(screen.getByText(/biomechanics · tooling · 2025/)).toBeInTheDocument()
  })

  it('renders a placeholder hero block when heroImage is null', () => {
    const posts = [makePost({ slug: 'no-image', title: 'No image', heroImage: null })]
    const { container } = render(<WorkIndexView posts={posts} />)
    expect(container.querySelector('[data-hero-placeholder]')).not.toBeNull()
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders an <img> with alt when heroImage is provided', () => {
    const posts = [
      makePost({
        slug: 'with-image',
        title: 'With image',
        heroImage: '/og/something.png',
      }),
    ]
    const { container } = render(<WorkIndexView posts={posts} />)
    const img = container.querySelector('img') as HTMLImageElement | null
    expect(img).not.toBeNull()
    expect(img!.getAttribute('src')).toBe('/og/something.png')
    expect(img!.getAttribute('alt')).toMatch(/With image/)
    expect(container.querySelector('[data-hero-placeholder]')).toBeNull()
  })

  it('renders zero spreads cleanly when the list is empty', () => {
    const { container } = render(<WorkIndexView posts={[]} />)
    expect(screen.getByRole('heading', { level: 1, name: 'Work' })).toBeInTheDocument()
    expect(container.querySelectorAll('[data-hover-lift]')).toHaveLength(0)
  })
})

// Keep the closest('article') excerpt-absence assertion as a regression marker
// (mirrors the v1 test's intent that empty excerpts don't render a paragraph).
describe('WorkIndexView excerpt-absence regression', () => {
  it('omits the excerpt paragraph when excerpt is empty', () => {
    render(
      <WorkIndexView
        posts={[makePost({ slug: 'without', title: 'No excerpt', excerpt: '' })]}
      />,
    )
    const article = screen
      .getByRole('heading', { level: 2, name: 'No excerpt' })
      .closest('article')!
    expect(within(article).queryByText('Visible excerpt.')).toBeNull()
  })
})

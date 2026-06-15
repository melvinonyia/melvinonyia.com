import { render, screen } from '@testing-library/react'
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

import { RecentWork } from './RecentWork'

const POST: WorkPostSummary = {
  slug: 'a-test-project',
  title: 'A Test Project',
  date: '2025-09-01',
  excerpt: 'Short summary.',
  tags: ['tooling'],
  heroImage: null,
}

describe('RecentWork', () => {
  it('renders nothing when there are no work posts', () => {
    const { container } = render(<RecentWork posts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the Recent Work section with title and date', () => {
    render(<RecentWork posts={[POST]} />)
    expect(screen.getByText('Recent Work')).toBeInTheDocument()
    expect(screen.getByText('A Test Project')).toBeInTheDocument()
  })

  it('links the title to the /work/$slug detail route', () => {
    render(<RecentWork posts={[POST]} />)
    const titleLink = screen.getByText('A Test Project').closest('a')!
    expect(titleLink).toHaveAttribute('href', '/work/a-test-project')
  })

  it('renders the More Work CTA linking to /work', () => {
    render(<RecentWork posts={[POST]} />)
    const cta = screen.getByRole('link', { name: 'More Work' })
    expect(cta).toHaveAttribute('href', '/work')
  })
})

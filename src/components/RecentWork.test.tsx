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
  tags: ['tooling', 'infra'],
  heroImage: null,
  ogImage: null,
}

describe('RecentWork', () => {
  it('renders nothing when there are no posts', () => {
    const { container } = render(<RecentWork posts={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the Selected work eyebrow + a row per post', () => {
    render(<RecentWork posts={[POST]} />)
    expect(screen.getByText('Selected work')).toBeInTheDocument()
    expect(screen.getByText('A Test Project')).toBeInTheDocument()
    expect(screen.getByText('Short summary.')).toBeInTheDocument()
  })

  it('shows the year derived from the post date', () => {
    render(<RecentWork posts={[POST]} />)
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('shows the tag list joined as a stack line', () => {
    render(<RecentWork posts={[POST]} />)
    expect(screen.getByText('tooling · infra')).toBeInTheDocument()
  })

  it('links the row to /work/$slug', () => {
    render(<RecentWork posts={[POST]} />)
    const row = screen.getByLabelText('A Test Project')
    expect(row).toHaveAttribute('href', '/work/a-test-project')
  })

  it('renders the More Work CTA linking to /work', () => {
    render(<RecentWork posts={[POST]} />)
    const cta = screen.getByRole('link', { name: 'More Work' })
    expect(cta).toHaveAttribute('href', '/work')
  })
})

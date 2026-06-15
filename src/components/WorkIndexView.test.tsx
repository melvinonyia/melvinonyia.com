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

import { WorkIndexView } from './WorkIndexView'

const POST: WorkPostSummary = {
  slug: 'a-test-project',
  title: 'A Test Project',
  date: '2025-09-01',
  excerpt: 'Short summary.',
  tags: ['tooling'],
  heroImage: null,
}

describe('WorkIndexView', () => {
  it('renders the Work header', () => {
    render(<WorkIndexView posts={[]} />)
    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('shows an empty-state message when there are no posts', () => {
    render(<WorkIndexView posts={[]} />)
    expect(screen.getByText(/No projects yet/)).toBeInTheDocument()
  })

  it('renders post title, date, and excerpt when posts exist', () => {
    render(<WorkIndexView posts={[POST]} />)
    expect(screen.getByText('A Test Project')).toBeInTheDocument()
    expect(screen.getByText('Short summary.')).toBeInTheDocument()
    expect(screen.getByText(/(?:Aug|Sep) 2025/)).toBeInTheDocument()
  })

  it('links the title to /work/$slug', () => {
    render(<WorkIndexView posts={[POST]} />)
    const link = screen.getByText('A Test Project').closest('a')!
    expect(link).toHaveAttribute('href', '/work/a-test-project')
  })
})

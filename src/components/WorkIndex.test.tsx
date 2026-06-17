import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import type { CaseStudySummary } from '~/lib/content/work'

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

import { WorkIndex } from './WorkIndex'

const CASE_STUDY: CaseStudySummary = {
  slug: 'a-test-case-study',
  title: 'A Test Case Study',
  published: '2025-09-01',
  dek: 'Short summary.',
  tags: ['tooling'],
  leadImage: null,
  ogImage: null,
  featured: false,
}

describe('WorkIndex', () => {
  it('renders the Work header', () => {
    render(<WorkIndex caseStudies={[]} />)
    expect(screen.getByText('Work')).toBeInTheDocument()
  })

  it('shows an empty-state message when there are no case studies', () => {
    render(<WorkIndex caseStudies={[]} />)
    expect(screen.getByText(/No case studies yet/)).toBeInTheDocument()
  })

  it('renders the card with title, dek, and uppercase meta', () => {
    render(<WorkIndex caseStudies={[CASE_STUDY]} />)
    expect(screen.getByText('A Test Case Study')).toBeInTheDocument()
    expect(screen.getByText('Short summary.')).toBeInTheDocument()
    expect(screen.getByText('TOOLING')).toBeInTheDocument()
  })

  it('links the card to /work/$slug', () => {
    render(<WorkIndex caseStudies={[CASE_STUDY]} />)
    const card = screen.getByLabelText('A Test Case Study')
    expect(card).toHaveAttribute('href', '/work/a-test-case-study')
  })
})

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

import { WorkPreview } from './WorkPreview'

const CASE_STUDY: CaseStudySummary = {
  slug: 'a-test-case-study',
  title: 'A Test Case Study',
  published: '2025-09-01',
  dek: 'Short summary.',
  tags: ['tooling', 'infra'],
  leadImage: null,
  ogImage: null,
}

describe('WorkPreview', () => {
  it('renders nothing when there are no cases', () => {
    const { container } = render(<WorkPreview caseStudies={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the Selected work eyebrow + a row per case', () => {
    render(<WorkPreview caseStudies={[CASE_STUDY]} />)
    expect(screen.getByText('Selected work')).toBeInTheDocument()
    expect(screen.getByText('A Test Case Study')).toBeInTheDocument()
    expect(screen.getByText('Short summary.')).toBeInTheDocument()
  })

  it('shows the year derived from the case published date', () => {
    render(<WorkPreview caseStudies={[CASE_STUDY]} />)
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('shows the tag list joined as a stack line', () => {
    render(<WorkPreview caseStudies={[CASE_STUDY]} />)
    expect(screen.getByText('tooling · infra')).toBeInTheDocument()
  })

  it('links the row to /work/$slug', () => {
    render(<WorkPreview caseStudies={[CASE_STUDY]} />)
    const row = screen.getByLabelText('A Test Case Study')
    expect(row).toHaveAttribute('href', '/work/a-test-case-study')
  })

  it('renders the More work CTA linking to /work', () => {
    render(<WorkPreview caseStudies={[CASE_STUDY]} />)
    const cta = screen.getByRole('link', { name: 'More work' })
    expect(cta).toHaveAttribute('href', '/work')
  })
})

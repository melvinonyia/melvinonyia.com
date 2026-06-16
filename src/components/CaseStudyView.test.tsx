import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CaseStudyView } from './CaseStudyView'
import type { CaseStudy } from '~/lib/content/work'

function makeCaseStudy(overrides: Partial<CaseStudy> = {}): CaseStudy {
  const Body: CaseStudy['Body'] = () => <p>Body content from the MDX module.</p>
  return {
    slug: 'movement-fingerprint',
    title: 'Movement fingerprint engine',
    published: '2025-11-12',
    dek: 'A signal-processing engine for movement data.',
    tags: ['ml', 'signal-processing'],
    leadImage: null,
    ogImage: null,
    Body,
    ...overrides,
  }
}

describe('CaseStudyView', () => {
  it('renders the case study title and dek as inline subtitle', () => {
    render(<CaseStudyView caseStudy={makeCaseStudy()} position={0} />)
    expect(screen.getByText('Movement fingerprint engine')).toBeInTheDocument()
    expect(
      screen.getByText(/A signal-processing engine for movement data/),
    ).toBeInTheDocument()
  })

  it('renders the MDX body content', () => {
    render(<CaseStudyView caseStudy={makeCaseStudy()} position={0} />)
    expect(
      screen.getByText('Body content from the MDX module.'),
    ).toBeInTheDocument()
  })

  it('renders the primary tag as the uppercase category label', () => {
    const { container } = render(<CaseStudyView caseStudy={makeCaseStudy()} position={0} />)
    const category = container.querySelector('.detail-layout-category')
    expect(category).not.toBeNull()
    expect(category!.textContent).toBe('ml')
  })

  it('renders the Last updated line with the formatted date', () => {
    const { container } = render(<CaseStudyView caseStudy={makeCaseStudy()} position={0} />)
    const updated = container.querySelector('.detail-layout-updated')
    expect(updated).not.toBeNull()
    expect(updated!.textContent).toMatch(/Last updated: November \d+, 2025/)
  })

  it('renders the lead image when provided', () => {
    const { container } = render(
      <CaseStudyView
        caseStudy={makeCaseStudy({ leadImage: '/lead.jpg' })}
        position={0}
      />,
    )
    const lead = container.querySelector('.detail-layout-lead') as HTMLImageElement
    expect(lead).not.toBeNull()
    expect(lead.getAttribute('src')).toBe('/lead.jpg')
  })

  it('renders the tag pills in the footer', () => {
    const { container } = render(<CaseStudyView caseStudy={makeCaseStudy()} position={0} />)
    const tags = Array.from(
      container.querySelectorAll('.detail-layout-tag'),
    ).map((el) => el.textContent)
    expect(tags).toEqual(['ml', 'signal-processing'])
  })
})

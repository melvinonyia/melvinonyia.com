import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WritingPostView } from './WritingPostView'
import type { Essay } from '~/lib/content/writing'

function makeEssay(overrides: Partial<Essay> = {}): Essay {
  const Body: Essay['Body'] = () => <p>Body content from the MDX module.</p>
  return {
    slug: 'a-test-essay',
    title: 'A Test Essay',
    date: '2025-10-08',
    excerpt: 'A short excerpt.',
    tags: ['infrastructure', 'notes'],
    readTime: 4,
    Body,
    ...overrides,
  }
}

describe('WritingPostView', () => {
  it('renders the essay title and excerpt as inline subtitle', () => {
    render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    expect(screen.getByText('A Test Essay')).toBeInTheDocument()
    expect(screen.getByText(/A short excerpt/)).toBeInTheDocument()
  })

  it('renders the MDX body content', () => {
    render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    expect(
      screen.getByText('Body content from the MDX module.'),
    ).toBeInTheDocument()
  })

  it('renders the primary tag as the uppercase category label', () => {
    const { container } = render(
      <WritingPostView essay={makeEssay()} essayNumber={1} />,
    )
    const category = container.querySelector('.article-detail-category')
    expect(category).not.toBeNull()
    expect(category!.textContent).toBe('infrastructure')
  })

  it('renders the Last updated line with the formatted date', () => {
    const { container } = render(
      <WritingPostView essay={makeEssay()} essayNumber={1} />,
    )
    const updated = container.querySelector('.article-detail-updated')
    expect(updated).not.toBeNull()
    expect(updated!.textContent).toMatch(/Last updated: October \d+, 2025/)
  })

  it('renders all tags as pills in the footer', () => {
    const { container } = render(
      <WritingPostView
        essay={makeEssay({ tags: ['code', 'notes'] })}
        essayNumber={1}
      />,
    )
    const tags = Array.from(
      container.querySelectorAll('.article-detail-tag'),
    ).map((el) => el.textContent)
    expect(tags).toEqual(['code', 'notes'])
  })

  it('renders share links to Facebook, X, and LinkedIn (desktop + mobile)', () => {
    render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    // Each network appears twice (vertical desktop + horizontal mobile).
    expect(screen.getAllByRole('link', { name: /Share on Facebook/ }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /Share on X/ }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('link', { name: /Share on LinkedIn/ }).length).toBeGreaterThanOrEqual(1)
  })
})

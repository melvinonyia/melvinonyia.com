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
    ogImage: null,
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

  it('renders X + LinkedIn share links and a Copy link button', () => {
    render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    expect(screen.getByRole('link', { name: 'Share on X' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Share on LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copy link' })).toBeInTheDocument()
  })

  it('renders the readtime line when the essay has readTime set', () => {
    render(<WritingPostView essay={makeEssay({ readTime: 7 })} essayNumber={1} />)
    expect(screen.getByText('7 min read')).toBeInTheDocument()
  })
})

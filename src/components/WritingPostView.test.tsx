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
    tags: ['biomechanics'],
    readTime: 4,
    Body,
    ...overrides,
  }
}

describe('WritingPostView', () => {
  it('renders the essay title', () => {
    render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    expect(screen.getByText('A Test Essay')).toBeInTheDocument()
  })

  it('renders the MDX body content', () => {
    render(<WritingPostView essay={makeEssay()} essayNumber={1} />)
    expect(
      screen.getByText('Body content from the MDX module.'),
    ).toBeInTheDocument()
  })

  it('renders the date and read time in the meta', () => {
    const { container } = render(
      <WritingPostView essay={makeEssay({ readTime: 5 })} essayNumber={1} />,
    )
    const meta = container.querySelector('.writing-post-meta')!
    expect(meta.textContent).toMatch(/October \d+, 2025/)
    expect(meta.textContent).toMatch(/5 min read/)
  })

  it('omits the read time when not provided', () => {
    render(
      <WritingPostView
        essay={makeEssay({ readTime: undefined })}
        essayNumber={1}
      />,
    )
    expect(screen.queryByText(/min read/)).toBeNull()
  })
})

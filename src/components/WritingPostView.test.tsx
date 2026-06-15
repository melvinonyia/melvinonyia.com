import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WritingPostView } from './WritingPostView'
import type { Essay } from '~/lib/content/writing'

function makeEssay(overrides: Partial<Essay> = {}): Essay {
  return {
    slug: 'the-leg-between-lab-and-field',
    title: 'The leg between lab and field',
    date: '2025-10-08',
    excerpt: 'Most movement-science findings die between publication and practice.',
    tags: ['notes', 'biomechanics'],
    Body: () => <p>Body content from the MDX module.</p>,
    ...overrides,
  }
}

describe('WritingPostView', () => {
  it('renders the title as the page heading', () => {
    render(<WritingPostView essay={makeEssay()} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'The leg between lab and field',
    )
  })

  it('renders the publication date with a machine-readable datetime', () => {
    render(<WritingPostView essay={makeEssay({ date: '2025-10-08' })} />)
    const time = screen.getByText(/October|2025/).closest('time')!
    expect(time).toHaveAttribute('datetime', '2025-10-08')
  })

  it('renders the MDX body component', () => {
    render(<WritingPostView essay={makeEssay()} />)
    expect(screen.getByText('Body content from the MDX module.')).toBeInTheDocument()
  })

  it('renders tag chips when tags are present', () => {
    render(<WritingPostView essay={makeEssay({ tags: ['notes'] })} />)
    expect(screen.getByText('notes')).toBeInTheDocument()
  })

  it('omits the tag list when there are no tags', () => {
    render(<WritingPostView essay={makeEssay({ tags: [] })} />)
    expect(screen.queryByRole('list')).toBeNull()
  })
})

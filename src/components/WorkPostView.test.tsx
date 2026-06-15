import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkPostView } from './WorkPostView'
import type { WorkPost } from '~/lib/content/work'

function makePost(overrides: Partial<WorkPost> = {}): WorkPost {
  return {
    slug: 'movement-fingerprint',
    title: 'Movement fingerprint engine',
    date: '2025-11-12',
    excerpt: 'Per-athlete kinematic signatures.',
    tags: ['biomechanics', 'signal processing'],
    heroImage: null,
    Body: () => <p>Body content from the MDX module.</p>,
    ...overrides,
  }
}

describe('WorkPostView', () => {
  it('renders the title as the page heading', () => {
    render(<WorkPostView post={makePost()} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Movement fingerprint engine',
    )
  })

  it('renders the publication date with a machine-readable datetime', () => {
    render(<WorkPostView post={makePost({ date: '2025-11-12' })} />)
    const time = screen.getByText(/November|2025/).closest('time')!
    expect(time).toHaveAttribute('datetime', '2025-11-12')
  })

  it('renders the MDX body component', () => {
    render(<WorkPostView post={makePost()} />)
    expect(screen.getByText('Body content from the MDX module.')).toBeInTheDocument()
  })

  it('renders tag chips when tags are present', () => {
    render(<WorkPostView post={makePost({ tags: ['biomechanics', 'tooling'] })} />)
    expect(screen.getByText('biomechanics')).toBeInTheDocument()
    expect(screen.getByText('tooling')).toBeInTheDocument()
  })

  it('omits the tag list when there are no tags', () => {
    render(<WorkPostView post={makePost({ tags: [] })} />)
    expect(screen.queryByRole('list')).toBeNull()
  })
})

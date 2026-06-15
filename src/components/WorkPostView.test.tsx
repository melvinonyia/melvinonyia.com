import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WorkPostView } from './WorkPostView'
import type { WorkPost } from '~/lib/content/work'

function makePost(overrides: Partial<WorkPost> = {}): WorkPost {
  const Body: WorkPost['Body'] = () => <p>Body content from the MDX module.</p>
  return {
    slug: 'movement-fingerprint',
    title: 'Movement fingerprint engine',
    date: '2025-11-12',
    excerpt: 'A signal-processing engine for movement data.',
    tags: ['ml', 'signal-processing'],
    heroImage: null,
    Body,
    ...overrides,
  }
}

describe('WorkPostView', () => {
  it('renders the post title', () => {
    render(<WorkPostView post={makePost()} position={0} />)
    expect(screen.getByText('Movement fingerprint engine')).toBeInTheDocument()
  })

  it('renders the MDX body content', () => {
    render(<WorkPostView post={makePost()} position={0} />)
    expect(
      screen.getByText('Body content from the MDX module.'),
    ).toBeInTheDocument()
  })

  it('renders the date and tags in the meta line', () => {
    const { container } = render(<WorkPostView post={makePost()} position={0} />)
    const meta = container.querySelector('.writing-post-meta')!
    expect(meta.textContent).toMatch(/November \d+, 2025/)
    expect(meta.textContent).toMatch(/ml/)
  })

  it('renders the hero image when provided', () => {
    render(
      <WorkPostView
        post={makePost({ heroImage: '/hero.jpg' })}
        position={0}
      />,
    )
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/hero.jpg')
  })
})

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

  it('renders the post excerpt as the subtitle', () => {
    render(<WorkPostView post={makePost()} position={0} />)
    expect(
      screen.getByText(/A signal-processing engine for movement data/),
    ).toBeInTheDocument()
  })

  it('renders the MDX body content', () => {
    render(<WorkPostView post={makePost()} position={0} />)
    expect(
      screen.getByText('Body content from the MDX module.'),
    ).toBeInTheDocument()
  })

  it('renders the date and tag in the meta line', () => {
    const { container } = render(<WorkPostView post={makePost()} position={0} />)
    const meta = container.querySelector('.article-detail-meta')!
    expect(meta.textContent).toMatch(/November \d+, 2025/)
    expect(meta.textContent).toMatch(/ml/)
  })

  it('renders the hero image when provided', () => {
    const { container } = render(
      <WorkPostView
        post={makePost({ heroImage: '/hero.jpg' })}
        position={0}
      />,
    )
    const hero = container.querySelector('.article-detail-hero') as HTMLImageElement
    expect(hero).not.toBeNull()
    expect(hero.getAttribute('src')).toBe('/hero.jpg')
  })

  it('renders the tag pills in the footer', () => {
    const { container } = render(<WorkPostView post={makePost()} position={0} />)
    const tags = Array.from(
      container.querySelectorAll('.article-detail-tag'),
    ).map((el) => el.textContent)
    expect(tags).toEqual(['ml', 'signal-processing'])
  })

  it('renders share links to X, LinkedIn, and Facebook', () => {
    render(<WorkPostView post={makePost()} position={0} />)
    expect(screen.getByRole('link', { name: /Share on X/ })).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Share on LinkedIn/ }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /Share on Facebook/ }),
    ).toBeInTheDocument()
  })
})

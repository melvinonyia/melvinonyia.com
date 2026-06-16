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
    ogImage: null,
    Body,
    ...overrides,
  }
}

describe('WorkPostView', () => {
  it('renders the post title and excerpt as inline subtitle', () => {
    render(<WorkPostView post={makePost()} position={0} />)
    expect(screen.getByText('Movement fingerprint engine')).toBeInTheDocument()
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

  it('renders the primary tag as the uppercase category label', () => {
    const { container } = render(<WorkPostView post={makePost()} position={0} />)
    const category = container.querySelector('.article-detail-category')
    expect(category).not.toBeNull()
    expect(category!.textContent).toBe('ml')
  })

  it('renders the Last updated line with the formatted date', () => {
    const { container } = render(<WorkPostView post={makePost()} position={0} />)
    const updated = container.querySelector('.article-detail-updated')
    expect(updated).not.toBeNull()
    expect(updated!.textContent).toMatch(/Last updated: November \d+, 2025/)
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
})

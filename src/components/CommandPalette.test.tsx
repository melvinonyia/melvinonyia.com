import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { SearchEntry } from '~/lib/search/indexer'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

beforeEach(() => {
  navigateMock.mockReset()
  ;(window as Window & { matchMedia: typeof window.matchMedia }).matchMedia = vi.fn(
    (query: string) =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true,
      }) as unknown as MediaQueryList,
  )
})

afterEach(() => {
  ;(window as Window & { matchMedia?: typeof window.matchMedia }).matchMedia = undefined!
  cleanup()
})

import { CommandPalette } from './CommandPalette'

const FIXTURE: SearchEntry[] = [
  { id: 'route:home', kind: 'route', title: 'Home', to: '/' },
  { id: 'route:work', kind: 'route', title: 'Work', to: '/work' },
  {
    id: 'work:fingerprint',
    kind: 'work',
    title: 'Movement fingerprint',
    excerpt: 'Gait individuality',
    to: '/work/$slug',
    params: { slug: 'movement-fingerprint' },
  },
  {
    id: 'ext:github',
    kind: 'external',
    title: 'GitHub',
    href: 'https://github.com/x',
  },
]

describe('CommandPalette', () => {
  it('renders a search input that is focused on open', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/search/i)
    expect(input).toHaveFocus()
  })

  it('lists all entries when the query is empty', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Work')).toBeInTheDocument()
    expect(screen.getByText('Movement fingerprint')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('filters results as the user types', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'fingerprint' },
    })
    expect(screen.getByText('Movement fingerprint')).toBeInTheDocument()
    expect(screen.queryByText('Home')).toBeNull()
    expect(screen.queryByText('GitHub')).toBeNull()
  })

  it('shows a no-results affordance when nothing matches', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: 'qqqqqq' },
    })
    expect(screen.getByText(/no results/i)).toBeInTheDocument()
  })

  it('Esc fires onClose', () => {
    const onClose = vi.fn()
    render(<CommandPalette entries={FIXTURE} onClose={onClose} />)
    fireEvent.keyDown(screen.getByPlaceholderText(/search/i), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking the backdrop fires onClose', () => {
    const onClose = vi.fn()
    const { container } = render(
      <CommandPalette entries={FIXTURE} onClose={onClose} />,
    )
    const backdrop = container.querySelector('[data-palette-backdrop]') as HTMLElement
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('marks the first result as selected by default', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    const items = screen.getAllByRole('option')
    expect(items[0]).toHaveAttribute('aria-selected', 'true')
    expect(items[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('ArrowDown moves the selection down', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    fireEvent.keyDown(screen.getByPlaceholderText(/search/i), { key: 'ArrowDown' })
    const items = screen.getAllByRole('option')
    expect(items[0]).toHaveAttribute('aria-selected', 'false')
    expect(items[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('ArrowUp from the top wraps to the last result', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    fireEvent.keyDown(screen.getByPlaceholderText(/search/i), { key: 'ArrowUp' })
    const items = screen.getAllByRole('option')
    expect(items[items.length - 1]).toHaveAttribute('aria-selected', 'true')
  })

  it('Enter on a route entry calls navigate with the route props and closes', () => {
    const onClose = vi.fn()
    render(<CommandPalette entries={FIXTURE} onClose={onClose} />)
    fireEvent.keyDown(screen.getByPlaceholderText(/search/i), { key: 'Enter' })
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/' }),
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('clicking a result activates it', () => {
    const onClose = vi.fn()
    render(<CommandPalette entries={FIXTURE} onClose={onClose} />)
    fireEvent.click(screen.getByText('Work'))
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/work' }),
    )
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('renders external entries as anchors with rel=noopener and target=_blank', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    const link = screen
      .getByText('GitHub')
      .closest('a, [role="option"]') as HTMLElement
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', 'https://github.com/x')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel') ?? '').toContain('noopener')
  })

  it('exposes the listbox with role=listbox for assistive tech', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})

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
    expect(screen.getByText('Movement fingerprint')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    // 'Work' appears twice — once as a route title, once as a kind label
    // on the work case study row. The listbox renders exactly four entries.
    expect(screen.getAllByRole('option')).toHaveLength(4)
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
    // Use 'Home' (unique) — 'Work' appears as both a title and a kind label.
    fireEvent.click(screen.getByText('Home'))
    expect(navigateMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/' }),
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

  it('marks the active row with the is-selected class', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    const items = screen.getAllByRole('option')
    expect(items[0]!.className).toMatch(/is-selected/)
    expect(items[1]!.className).not.toMatch(/is-selected/)
  })

  it('moves the is-selected class when ArrowDown changes selection', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    fireEvent.keyDown(screen.getByPlaceholderText(/search/i), { key: 'ArrowDown' })
    const items = screen.getAllByRole('option')
    expect(items[0]!.className).not.toMatch(/is-selected/)
    expect(items[1]!.className).toMatch(/is-selected/)
  })

  it('renders the input with the palette-input class', () => {
    render(<CommandPalette entries={FIXTURE} onClose={vi.fn()} />)
    const input = screen.getByPlaceholderText(/search/i)
    expect(input.className).toMatch(/palette-input/)
  })
})

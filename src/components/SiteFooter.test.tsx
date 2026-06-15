import { render, screen, within, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

import { SiteFooter } from './SiteFooter'

describe('SiteFooter', () => {
  beforeEach(() => navigateMock.mockReset())

  it('renders the Build things, solve problems tagline', () => {
    render(<SiteFooter year={2026} />)
    expect(screen.getByText('Build things, solve problems')).toBeInTheDocument()
  })

  it('renders the three nav column headers', () => {
    render(<SiteFooter year={2026} />)
    expect(screen.getByText('Profile')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders About / Writing / Contact navigation buttons', () => {
    render(<SiteFooter year={2026} />)
    const navList = screen.getByText('Profile').closest('ul')!
    expect(within(navList).getByText('About')).toBeInTheDocument()
    expect(within(navList).getByText('Writing')).toBeInTheDocument()
    expect(within(navList).getByText('Contact')).toBeInTheDocument()
  })

  it('renders the copyright credit with the year and Privacy & Terms', () => {
    render(<SiteFooter year={2026} />)
    expect(screen.getByText(/2026/)).toBeInTheDocument()
    const privacy = screen.getByRole('button', { name: 'Privacy & Terms' })
    expect(privacy).toBeInTheDocument()
  })

  it('navigates to /legal when Privacy & Terms is clicked', () => {
    render(<SiteFooter year={2026} />)
    fireEvent.click(screen.getByRole('button', { name: 'Privacy & Terms' }))
    expect(navigateMock).toHaveBeenCalledWith({ to: '/legal' })
  })
})

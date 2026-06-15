import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

import { NotFoundView } from './NotFoundView'

describe('NotFoundView', () => {
  beforeEach(() => navigateMock.mockReset())

  it('renders the Sorry! heading', () => {
    render(<NotFoundView />)
    expect(screen.getByText('Sorry!')).toBeInTheDocument()
  })

  it('renders the "not available" subtitle', () => {
    render(<NotFoundView />)
    expect(screen.getByText(/page you are looking for is not available/)).toBeInTheDocument()
  })

  it('clicks the Try again button to navigate home', () => {
    render(<NotFoundView />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
  })
})

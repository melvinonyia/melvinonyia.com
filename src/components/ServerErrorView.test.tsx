import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

const navigateMock = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => navigateMock,
}))

import { ServerErrorView } from './ServerErrorView'

describe('ServerErrorView', () => {
  beforeEach(() => navigateMock.mockReset())

  it('renders the Sorry! heading', () => {
    render(<ServerErrorView />)
    expect(screen.getByText('Sorry!')).toBeInTheDocument()
  })

  it('renders the something went wrong subtitle', () => {
    render(<ServerErrorView />)
    expect(screen.getByText(/Something went wrong/)).toBeInTheDocument()
  })

  it('clicks the Try again button to navigate home', () => {
    render(<ServerErrorView />)
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(navigateMock).toHaveBeenCalledWith({ to: '/' })
  })
})

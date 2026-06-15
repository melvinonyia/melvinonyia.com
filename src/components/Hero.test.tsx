import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the name and pitch', () => {
    render(<Hero name="Melvin Onyia" pitch="Toolchain online." />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Melvin Onyia')
    expect(screen.getByText('Toolchain online.')).toBeInTheDocument()
  })
})

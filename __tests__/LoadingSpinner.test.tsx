import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { LoadingSpinner } from '../app/components/LoadingSpinner'

describe('LoadingSpinner', () => {
  test('renders with correct heading', () => {
    render(<LoadingSpinner />)
    const headingElement = screen.getByRole('heading', {
      level: 1,
      name: 'Loading',
    })
    expect(headingElement).toBeDefined()
  })

  test('h1 has aria-busy attribute', () => {
    const { container } = render(<LoadingSpinner />)
    const spinnerContainer = container.firstChild as HTMLElement
    expect(spinnerContainer.getAttribute('aria-busy'))
  })
})

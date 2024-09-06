import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, test } from 'vitest'

import { LoadingSpinner } from '@/app/components/LoadingSpinner'

afterEach(cleanup)

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
    render(<LoadingSpinner />)
    const headingElement = screen.getByRole('heading', {
      level: 1,
    })

    expect(headingElement.getAttribute('aria-busy')).toBeTruthy()
  })
})

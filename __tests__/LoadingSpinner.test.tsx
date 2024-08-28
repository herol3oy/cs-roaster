import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import { LoadingSpinner } from '../app/components/LoadingSpinner'

test('LoadingSpinner renders with correct heading', () => {
  render(<LoadingSpinner />)
  const headingElement = screen.getByRole('heading', {
    level: 1,
    name: 'Loading',
  })
  expect(headingElement).toBeDefined()
})

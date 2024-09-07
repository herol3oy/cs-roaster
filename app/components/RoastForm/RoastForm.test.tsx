import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { afterEach, describe, expect, test, vi } from 'vitest'

import { RoastForm } from '@/app/components/RoastForm'

const mockSetResult = vi.fn()
const mockStartTransition = vi.fn()
const mockInputRef = createRef<HTMLInputElement>()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}))

vi.mock('../utils/is-couchsurfing-url', () => ({
  isCouchsurfingUrl: (url: string) => url.includes('couchsurfing.com'),
}))

afterEach(cleanup)

describe('RoastForm', () => {
  const renderRoastForm = () => {
    render(
      <RoastForm
        setResult={mockSetResult}
        startTransition={mockStartTransition}
        isPending={false}
        inputRef={mockInputRef}
      />,
    )
  }

  const getInput = () =>
    screen.getByPlaceholderText(/couchsurfing/i) as HTMLInputElement
  const getForm = () => screen.getByRole('form')

  test('renders an input', () => {
    renderRoastForm()
    const input = getInput()
    expect(input).toBeDefined()
  })
})

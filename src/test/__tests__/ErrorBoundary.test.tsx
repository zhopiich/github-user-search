import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ErrorBoundary from '../../components/ErrorBoundary'

function BrokenComponent(): null {
  throw new Error('Render failed')
}

function StableComponent() {
  return <p>Recovered content</p>
}

let shouldThrow = false

function MaybeBrokenComponent() {
  if (shouldThrow)
    throw new Error('Temporary failure')

  return <StableComponent />
}

afterEach(() => {
  shouldThrow = false
  vi.restoreAllMocks()
})

describe('errorBoundary', () => {
  it('renders fallback when a child throws during render', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary
        fallback={({ error }) => (
          <p role="alert">{error.message}</p>
        )}
      >
        <BrokenComponent />
      </ErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Render failed')
  })

  it('can reset after rendering the fallback', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const onReset = vi.fn()
    shouldThrow = true

    render(
      <ErrorBoundary
        onReset={onReset}
        fallback={({ resetErrorBoundary }) => (
          <button
            type="button"
            onClick={() => {
              shouldThrow = false
              resetErrorBoundary()
            }}
          >
            Try again
          </button>
        )}
      >
        <MaybeBrokenComponent />
      </ErrorBoundary>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Try again' }))

    expect(onReset).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Recovered content')).toBeInTheDocument()
  })
})

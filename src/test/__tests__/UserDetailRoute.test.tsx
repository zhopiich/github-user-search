import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { server } from '../mocks/server'

function renderUserRoute(path = '/user/alice') {
  window.history.pushState({}, '', path)
  return render(<App />)
}

afterEach(() => {
  vi.restoreAllMocks()
  window.history.pushState({}, '', '/')
})

describe('user detail route boundaries', () => {
  it('shows Suspense fallback while loading user detail', async () => {
    renderUserRoute()

    expect(screen.getByText('Loading user...')).toBeInTheDocument()

    await waitForElementToBeRemoved(() => screen.queryByText('Loading user...'))
  })

  it('renders user detail after the Suspense query resolves', async () => {
    renderUserRoute()

    expect(await screen.findByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    expect(screen.getByText('@alice')).toBeInTheDocument()
  })

  it('renders the route error fallback when the user request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get('https://api.github.com/users/:login', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 })
      }),
    )

    renderUserRoute('/user/fail')

    expect(await screen.findByRole('alert')).toHaveTextContent('GitHub API error: 500')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })

  it('keeps the app shell visible when the route renders an error fallback', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get('https://api.github.com/users/:login', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 })
      }),
    )

    renderUserRoute('/user/fail')

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'GitHub User Search' })).toBeInTheDocument()
  })
})

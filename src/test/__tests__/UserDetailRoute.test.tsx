import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { server } from '../mocks/server'

function renderUserRoute(path = '/user/alice') {
  window.history.pushState({}, '', path)
  return render(<App />)
}

afterEach(() => {
  vi.restoreAllMocks()
  server.resetHandlers()
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

  it('renders overview content for the user detail index route', async () => {
    renderUserRoute('/user/alice')

    expect(await screen.findByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveClass('active')
    expect(screen.getByRole('link', { name: 'Repos' })).toHaveAttribute('href', '/user/alice/repos')
    expect(screen.getByText('No bio provided.')).toBeInTheDocument()
  })

  it('renders repositories for the repos child route', async () => {
    renderUserRoute('/user/alice/repos')

    expect(await screen.findByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Repos' })).toHaveClass('active')
    expect(await screen.findByRole('link', { name: 'react-learning' })).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('loads the next repository page from the repos child route', async () => {
    const user = userEvent.setup()
    renderUserRoute('/user/alice/repos')

    await screen.findByRole('link', { name: 'react-learning' })

    await user.click(screen.getByRole('button', { name: 'Load more repositories' }))

    expect(await screen.findByRole('link', { name: 'second-page-repo' })).toBeInTheDocument()
    expect(screen.getByText('End of repositories')).toBeInTheDocument()
  })

  it('keeps the profile shell visible when the repos child route fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get('https://api.github.com/users/:login/repos', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 })
      }),
    )

    renderUserRoute('/user/repo-fail/repos')

    expect(await screen.findByRole('heading', { name: 'Alice' })).toBeInTheDocument()
    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 500')
    expect(screen.getByRole('link', { name: 'Overview' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Repos' })).toHaveClass('active')
  })

  it('renders the route error fallback when the user request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    server.use(
      http.get('https://api.github.com/users/:login', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 })
      }),
    )

    renderUserRoute('/user/fail')

    expect(await screen.findByRole('alert')).toHaveTextContent('HTTP 500: Internal Server ErrorTry again')
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

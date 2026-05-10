import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import SearchResults from '../../features/search/components/SearchResults'
import SearchPage from '../../features/search/pages/SearchPage'

vi.mock('../../features/search/components/VirtualUserGrid', () => ({
  default: ({ users }: { users: Array<{ login: string }> }) => (
    <div>
      {users.map(user => (
        <span key={user.login}>{user.login}</span>
      ))}
    </div>
  ),
}))

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
}

function TestProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={makeQueryClient()}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

function renderSearchPage(path = '/') {
  window.history.replaceState(null, '', path)

  render(
    <SearchPage />,
    { wrapper: TestProviders },
  )
}

describe('search page', () => {
  it('initializes the search input from the q URL param', async () => {
    renderSearchPage('/?q=react')

    expect(screen.getByRole('searchbox', { name: /search users/i })).toHaveValue('react')
    expect(await screen.findByText('page-one-user-10')).toBeInTheDocument()
  })

  it('updates the q URL param when the search input changes', async () => {
    const user = userEvent.setup()
    renderSearchPage('/')

    await user.type(screen.getByRole('searchbox', { name: /search users/i }), 'react')

    expect(window.location.search).toBe('?q=react')
  })

  it('shows an initial empty state before a query is entered', () => {
    renderSearchPage('/')

    expect(screen.getByText('Enter a GitHub username to search.')).toBeInTheDocument()
  })

  it('shows a loading state while the first search page is loading', () => {
    renderSearchPage('/?q=react')

    expect(screen.getByText('Loading users...')).toBeInTheDocument()
  })

  it('shows an error state with retry when search fails', async () => {
    renderSearchPage('/?q=fail')

    expect(await screen.findByText('Unable to load users.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
  })

  it('renders users when the search query resolves', async () => {
    renderSearchPage('/?q=react')

    expect(await screen.findByText('page-one-user-10')).toBeInTheDocument()
  })

  it('keeps current results visible while the next page is loading', () => {
    render(
      <SearchResults
        status="success"
        data={{
          users: [{
            id: 1,
            login: 'visible-user',
            avatar_url: 'https://avatars.githubusercontent.com/visible-user',
            html_url: 'https://github.com/visible-user',
          }],
          pagination: {
            hasMore: true,
            isLoadingMore: true,
          },
        }}
        error={null}
        onLoadMore={() => {}}
        onRetry={() => {}}
      />,
    )

    expect(screen.getByText('visible-user')).toBeInTheDocument()
    expect(screen.getByText('Loading more...')).toBeInTheDocument()
  })
})

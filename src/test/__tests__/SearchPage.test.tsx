import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import SearchResults from '@/features/search/components/SearchResults'
import SearchPage from '@/features/search/pages/SearchPage'
import { useSearchHistoryStore } from '@/store/searchHistoryStore'
import { useSearchNavigationStore } from '@/store/searchNavigationStore'

vi.mock('@/features/search/components/VirtualUserGrid', () => ({
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

beforeEach(() => {
  useSearchHistoryStore.setState({
    recentSearches: [],
    rememberSearchHistory: false,
  })
  useSearchNavigationStore.setState({ lastSearchQuery: '' })
})

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

  it('adds successful searches to recent searches', async () => {
    const user = userEvent.setup()
    renderSearchPage()

    await user.type(screen.getByLabelText('Search users'), 'alice')

    expect(await screen.findByRole('button', { name: 'Search alice again' })).toBeInTheDocument()
  })

  it('stores the last successful search query', async () => {
    const user = userEvent.setup()
    renderSearchPage()

    await user.type(screen.getByLabelText('Search users'), 'alice')

    await screen.findByText('page-one-user-10')
    expect(useSearchNavigationStore.getState().lastSearchQuery).toBe('alice')
  })

  it('does not store failed searches as the last successful search query', async () => {
    const user = userEvent.setup()
    useSearchNavigationStore.getState().setLastSearchQuery('react')
    renderSearchPage()

    await user.type(screen.getByLabelText('Search users'), 'fail')

    expect(await screen.findByText('Unable to load users.')).toBeInTheDocument()
    expect(useSearchNavigationStore.getState().lastSearchQuery).toBe('react')
  })

  it('does not clear the last successful search query when the input is cleared', async () => {
    const user = userEvent.setup()
    useSearchNavigationStore.getState().setLastSearchQuery('react')
    renderSearchPage('/?q=react')

    const input = screen.getByLabelText('Search users')
    await user.clear(input)

    expect(input).toHaveValue('')
    expect(useSearchNavigationStore.getState().lastSearchQuery).toBe('react')
  })

  it('uses a recent search to update the URL-backed search input', async () => {
    const user = userEvent.setup()
    useSearchHistoryStore.setState({
      recentSearches: ['react'],
      rememberSearchHistory: false,
    })
    renderSearchPage()

    await user.click(screen.getByRole('button', { name: 'Search react again' }))

    expect(screen.getByLabelText('Search users')).toHaveValue('react')
    expect(window.location.search).toBe('?q=react')
  })

  it('clears recent searches from the search page', async () => {
    const user = userEvent.setup()
    useSearchHistoryStore.setState({
      recentSearches: ['react'],
      rememberSearchHistory: false,
    })
    renderSearchPage()

    await user.click(screen.getByRole('button', { name: 'Clear recent searches' }))

    expect(screen.queryByRole('button', { name: 'Search react again' })).not.toBeInTheDocument()
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

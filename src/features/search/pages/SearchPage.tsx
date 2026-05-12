import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useDebounce } from '@/hooks/useDebounce'
import { useAuthStore } from '@/store/authStore'
import { useSearchHistoryStore } from '@/store/searchHistoryStore'
import { useSearchNavigationStore } from '@/store/searchNavigationStore'
import RecentSearches from '../components/RecentSearches'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { getSearchResultsData, getSearchResultsStatus } from '../components/SearchResults.state'
import TokenInput from '../components/TokenInput'
import { useSearchPageParams } from '../hooks/useSearchPageParams'
import { useSearchUsers } from '../hooks/useSearchUsers'
import '../search.css'

export default function SearchPage() {
  const token = useAuthStore(s => s.token)
  const setToken = useAuthStore(s => s.setToken)
  const {
    recentSearches,
    addSearch,
    clearSearches,
  } = useSearchHistoryStore(useShallow(s => ({
    recentSearches: s.recentSearches,
    addSearch: s.addSearch,
    clearSearches: s.clearSearches,
  })))
  const setLastSearchQuery = useSearchNavigationStore(s => s.setLastSearchQuery)

  const { query, setQuery } = useSearchPageParams()
  const queryClient = useQueryClient()

  const debouncedQuery = useDebounce(query, 200)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSearchUsers(debouncedQuery)
  const users = data?.pages.flatMap(page => page.items) ?? []
  const searchResultsStatus = getSearchResultsStatus({
    query: debouncedQuery.trim(),
    users,
    isLoading,
    isError,
  })
  const searchResultsData = getSearchResultsData({
    users,
    hasNextPage,
    isFetchingNextPage,
  })

  useEffect(() => {
    if (!debouncedQuery.trim() || !data)
      return

    addSearch(debouncedQuery)
    setLastSearchQuery(debouncedQuery)
  }, [addSearch, data, debouncedQuery, setLastSearchQuery])

  function handleQueryChange(value: string) {
    setQuery(value)
  }

  function handleTokenChange(value: string) {
    setToken(value)
    queryClient.cancelQueries({ queryKey: ['search-users'] })
    queryClient.cancelQueries({ queryKey: ['github-user'] })
    queryClient.removeQueries({ queryKey: ['search-users'] })
    queryClient.removeQueries({ queryKey: ['github-user'] })
  }

  return (
    <div className="page">
      <SearchBar value={query} onChange={handleQueryChange} />
      <RecentSearches searches={recentSearches} onSelect={setQuery} onClear={clearSearches} />
      <TokenInput value={token} onChange={handleTokenChange} />

      <SearchResults
        status={searchResultsStatus}
        data={searchResultsData}
        error={error}
        onLoadMore={fetchNextPage}
        onRetry={() => {
          queryClient.invalidateQueries({ queryKey: ['search-users'] })
        }}
      />
    </div>
  )
}

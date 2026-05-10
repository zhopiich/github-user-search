import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '../../../hooks/useDebounce'
import { useAuthStore } from '../../../store/authStore'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { getSearchResultsData, getSearchResultsStatus } from '../components/SearchResults.state'
import TokenInput from '../components/TokenInput'
import { useSearchPageParams } from '../hooks/useSearchPageParams'
import { useSearchUsers } from '../hooks/useSearchUsers'

export default function SearchPage() {
  const token = useAuthStore(s => s.token)
  const setToken = useAuthStore(s => s.setToken)

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

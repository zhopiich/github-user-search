import { useQueryClient } from '@tanstack/react-query'
import SearchBar from '../components/SearchBar'
import SearchResults from '../components/SearchResults'
import { getSearchResultsData, getSearchResultsStatus } from '../components/SearchResults.state'
import TokenInput from '../components/TokenInput'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchPageParams } from '../hooks/useSearchPageParams'
import { useSearchUsers } from '../hooks/useSearchUsers'

interface SearchPageProps {
  token: string
  onTokenChange: (value: string) => void
}

export default function SearchPage({ token, onTokenChange }: SearchPageProps) {
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
  } = useSearchUsers(debouncedQuery, token || undefined)
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
    onTokenChange(value)
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

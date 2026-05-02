import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import TokenInput from '../components/TokenInput'
import VirtualUserGrid from '../components/VirtualUserGrid'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchUsers } from '../hooks/useSearchUsers'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [token, setToken] = useState('')
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

  function handleQueryChange(value: string) {
    setSearchParams(value ? { q: value } : {}, { replace: true })
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

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}
      {!isLoading && !isError && users.length === 0 && debouncedQuery.trim() && (
        <p className="status">No users found.</p>
      )}

      <VirtualUserGrid
        users={users}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={fetchNextPage}
      />

      {isFetchingNextPage && <p className="status">Loading more...</p>}
      {!isLoading && !isError && users.length > 0 && !hasNextPage && (
        <p className="status">End of results</p>
      )}
    </div>
  )
}

import type { SearchResultsData, SearchResultsStatus } from './SearchResults.state'
import VirtualUserGrid from './VirtualUserGrid'

interface SearchResultsProps {
  status: SearchResultsStatus
  data: SearchResultsData
  error: Error | null
  onLoadMore: () => void
  onRetry: () => void
}

export default function SearchResults({
  status,
  data,
  error,
  onLoadMore,
  onRetry,
}: SearchResultsProps) {
  if (status === 'idle') {
    return (
      <p className="status">Enter a GitHub username to search.</p>
    )
  }

  if (status === 'loading') {
    return (
      <p className="status">Loading users...</p>
    )
  }

  if (status === 'error') {
    return (
      <div className="status error" role="alert">
        <p>Unable to load users.</p>
        {error?.message && <p>{error.message}</p>}
        <button type="button" onClick={onRetry}>Retry</button>
      </div>
    )
  }

  if (status === 'empty') {
    return (
      <p className="status">No users found.</p>
    )
  }

  return (
    <>
      <VirtualUserGrid
        users={data.users}
        hasNextPage={data.pagination.hasMore}
        isFetchingNextPage={data.pagination.isLoadingMore}
        onLoadMore={onLoadMore}
      />
      {data.pagination.isLoadingMore && <p className="status">Loading more...</p>}
      {!data.pagination.hasMore && <p className="status">End of results</p>}
    </>
  )
}

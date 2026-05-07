import type { GitHubUser } from '../types/github'

export type SearchResultsStatus = 'idle' | 'loading' | 'error' | 'empty' | 'success'

export interface SearchResultsData {
  users: GitHubUser[]
  pagination: {
    hasMore: boolean
    isLoadingMore: boolean
  }
}

interface GetSearchResultsStatusOptions {
  query: string
  users: GitHubUser[]
  isLoading: boolean
  isError: boolean
}

interface GetSearchResultsDataOptions {
  users: GitHubUser[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
}

export function getSearchResultsStatus({
  query,
  users,
  isLoading,
  isError,
}: GetSearchResultsStatusOptions): SearchResultsStatus {
  if (!query)
    return 'idle'

  if (isLoading)
    return 'loading'

  if (isError)
    return 'error'

  if (users.length === 0)
    return 'empty'

  return 'success'
}

export function getSearchResultsData({
  users,
  hasNextPage,
  isFetchingNextPage,
}: GetSearchResultsDataOptions): SearchResultsData {
  return {
    users,
    pagination: {
      hasMore: hasNextPage,
      isLoadingMore: isFetchingNextPage,
    },
  }
}

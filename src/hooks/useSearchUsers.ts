import type { SearchResult } from '../types/github'
import { useQuery } from '@tanstack/react-query'
import { githubFetch } from '../lib/githubFetch'

export function useSearchUsers(query: string, token?: string) {
  return useQuery({
    queryKey: ['search-users', query],
    queryFn: ({ signal }) => githubFetch<SearchResult>(
      `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=12`,
      token,
      signal,
    ),
    enabled: !!query.trim(),
    staleTime: 60_000,
  })
}

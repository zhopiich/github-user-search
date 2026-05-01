import type { SearchResult } from '../types/github'
import { useQuery } from '@tanstack/react-query'

async function fetchSearchUsers(query: string, token?: string): Promise<SearchResult> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(
    `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=12`,
    { headers },
  )
  if (!res.ok)
    throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export function useSearchUsers(query: string, token?: string) {
  return useQuery({
    queryKey: ['search-users', query, token],
    queryFn: () => fetchSearchUsers(query, token),
    enabled: !!query.trim(),
    staleTime: 60_000,
  })
}

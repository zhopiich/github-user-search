import type { SearchResult } from '@/types/github'
import { useInfiniteQuery } from '@tanstack/react-query'
import { githubFetch } from '@/lib/githubFetch'

const SEARCH_USERS_PER_PAGE = 30
const GITHUB_SEARCH_RESULT_LIMIT = 1000

export function useSearchUsers(query: string) {
  return useInfiniteQuery({
    queryKey: ['search-users', query],
    queryFn: ({ pageParam }) => githubFetch().get<SearchResult>('/search/users', { params: {
      q: encodeURIComponent(query),
      per_page: SEARCH_USERS_PER_PAGE,
      page: pageParam,
    } }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce((count, page) => count + page.items.length, 0)
      const availableCount = Math.min(lastPage.total_count, GITHUB_SEARCH_RESULT_LIMIT)

      if (lastPage.items.length === 0 || loadedCount >= availableCount)
        return undefined

      return allPages.length + 1
    },
    enabled: !!query.trim(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  })
}

import type { GitHubRepository } from '@/types/github'
import { useInfiniteQuery, useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { githubFetch } from '@/lib/githubFetch'

const USER_REPOS_PER_PAGE = 2

function userReposQueryOptions(login: string) {
  return {
    queryKey: ['github-user-repos', login],
    queryFn: ({ pageParam }: { pageParam: number }) => githubFetch().get<GitHubRepository[]>(`/users/${login}/repos`, {
      params: {
        per_page: USER_REPOS_PER_PAGE,
        page: pageParam,
        sort: 'updated',
      },
    }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: GitHubRepository[], allPages: GitHubRepository[][]) => {
      if (lastPage.length < USER_REPOS_PER_PAGE)
        return undefined

      return allPages.length + 1
    },
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  }
}

export function useUserRepos(login: string | undefined) {
  return useInfiniteQuery({
    ...userReposQueryOptions(login ?? ''),
    queryKey: ['github-user-repos', login],
    enabled: !!login,
  })
}

export function useSuspenseUserRepos(login: string) {
  return useSuspenseInfiniteQuery(userReposQueryOptions(login))
}

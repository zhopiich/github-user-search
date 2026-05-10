import type { GitHubUserDetail } from '../../../types/github'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { githubFetch } from '../../../lib/githubFetch'

function githubUserQueryOptions(login: string) {
  return {
    queryKey: ['github-user', login],
    queryFn: () => githubFetch().get<GitHubUserDetail>(`/users/${login}`),
    retry: false,
    staleTime: 60_000,
  }
}

export function useGitHubUser(login: string | undefined) {
  return useQuery({
    ...githubUserQueryOptions(login ?? ''),
    queryKey: ['github-user', login],
    enabled: !!login,
  })
}

export function useSuspenseGitHubUser(login: string) {
  return useSuspenseQuery(githubUserQueryOptions(login))
}

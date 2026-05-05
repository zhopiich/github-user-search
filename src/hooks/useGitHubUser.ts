import type { GitHubUserDetail } from '../types/github'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { githubFetch } from '../lib/githubFetch'

function githubUserQueryOptions(login: string, token?: string) {
  return {
    queryKey: ['github-user', login],
    queryFn: () => githubFetch<GitHubUserDetail>(`https://api.github.com/users/${login}`, token),
    retry: false,
    staleTime: 60_000,
  }
}

export function useGitHubUser(login: string | undefined, token?: string) {
  return useQuery({
    ...githubUserQueryOptions(login ?? '', token),
    queryKey: ['github-user', login],
    enabled: !!login,
  })
}

export function useSuspenseGitHubUser(login: string, token?: string) {
  return useSuspenseQuery(githubUserQueryOptions(login, token))
}

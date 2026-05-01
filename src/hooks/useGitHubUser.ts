import type { GitHubUserDetail } from '../types/github'
import { useQuery } from '@tanstack/react-query'
import { githubFetch } from '../lib/githubFetch'

export function useGitHubUser(login: string | undefined, token?: string) {
  return useQuery({
    queryKey: ['github-user', login],
    queryFn: ({ signal }) => githubFetch<GitHubUserDetail>(
      `https://api.github.com/users/${login}`,
      token,
      signal,
    ),
    enabled: !!login,
    staleTime: 60_000,
  })
}

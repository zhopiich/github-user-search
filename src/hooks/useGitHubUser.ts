import type { GitHubUserDetail } from '../types/github'
import { useQuery } from '@tanstack/react-query'
import { githubFetch } from '../lib/githubFetch'

export function useGitHubUser(login: string | undefined, token?: string) {
  return useQuery({
    queryKey: ['github-user', login],
    queryFn: () => githubFetch<GitHubUserDetail>(`https://api.github.com/users/${login}`, token),
    enabled: !!login,
    staleTime: 60_000,
  })
}

import type { GitHubUserDetail } from '../types/github'
import { useQuery } from '@tanstack/react-query'

async function fetchGitHubUser(login: string, token?: string): Promise<GitHubUserDetail> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(`https://api.github.com/users/${login}`, { headers })
  if (!res.ok)
    throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

export function useGitHubUser(login: string | undefined, token?: string) {
  return useQuery({
    queryKey: ['github-user', login, token],
    queryFn: () => fetchGitHubUser(login!, token),
    enabled: !!login,
    staleTime: 60_000,
  })
}

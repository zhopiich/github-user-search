import type { GitHubRepository } from '@/types/github'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { githubFetch } from '@/lib/githubFetch'

function githubRepositoryQueryOptions(login: string, repoName: string) {
  return {
    queryKey: ['github-repository', login, repoName],
    queryFn: () => githubFetch().get<GitHubRepository>(
      `/repos/${encodeURIComponent(login)}/${encodeURIComponent(repoName)}`,
    ),
    retry: false,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  }
}

export function useGitHubRepository(login: string | undefined, repoName: string | undefined) {
  return useQuery({
    ...githubRepositoryQueryOptions(login ?? '', repoName ?? ''),
    queryKey: ['github-repository', login, repoName],
    enabled: !!login && !!repoName,
  })
}

export function useSuspenseGitHubRepository(login: string, repoName: string) {
  return useSuspenseQuery(githubRepositoryQueryOptions(login, repoName))
}

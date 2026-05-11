import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import { PageErrorFallback, PageLoadingFallback } from '@/components/RouteFallbacks'
import RepositoryDetailPanel from '../components/RepositoryDetailPanel'
import { useSuspenseGitHubRepository } from '../hooks/useGitHubRepository'

function UserRepoDetailContent() {
  const { login, repoName } = useParams<{ login: string, repoName: string }>()

  if (!login)
    throw new Error('Missing GitHub login')
  if (!repoName)
    throw new Error('Missing GitHub repository name')

  const decodedRepoName = decodeURIComponent(repoName)
  const { data: repository } = useSuspenseGitHubRepository(login, decodedRepoName)

  return <RepositoryDetailPanel repository={repository} />
}

export default function UserRepoDetailRoute() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ error, resetErrorBoundary }) => (
            <PageErrorFallback error={error} onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PageLoadingFallback label="Loading repository..." />}>
            <UserRepoDetailContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

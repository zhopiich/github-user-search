import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'
import { useParams } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary'
import { PageErrorFallback, PageLoadingFallback } from '@/components/RouteFallbacks'
import UserReposPanel from '../components/UserReposPanel'
import { useSuspenseUserRepos } from '../hooks/useUserRepos'

function UserReposContent() {
  const { login } = useParams<{ login: string }>()

  if (!login)
    throw new Error('Missing GitHub login')

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseUserRepos(login)
  const repos = data.pages.flat()

  return (
    <UserReposPanel
      repos={repos}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onLoadMore={fetchNextPage}
    />
  )
}

export default function UserReposRoute() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={({ error, resetErrorBoundary }) => (
            <PageErrorFallback error={error} onRetry={resetErrorBoundary} />
          )}
        >
          <Suspense fallback={<PageLoadingFallback label="Loading repositories..." />}>
            <UserReposContent />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}

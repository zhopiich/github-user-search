import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useGitHubRepository } from '@/features/user/hooks/useGitHubRepository'

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useGitHubRepository', () => {
  it('fetches a repository by owner and repo name', async () => {
    const { result } = renderHook(
      () => useGitHubRepository('alice', 'react-learning'),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.full_name).toBe('alice/react-learning')
    expect(result.current.data?.default_branch).toBe('main')
  })

  it('does not run until both login and repo name exist', () => {
    const { result } = renderHook(
      () => useGitHubRepository('alice', undefined),
      { wrapper },
    )

    expect(result.current.fetchStatus).toBe('idle')
  })
})

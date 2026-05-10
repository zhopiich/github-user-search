import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { useUserRepos } from '../../features/user/hooks/useUserRepos'
import { server } from '../mocks/server'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useUserRepos', () => {
  it('does not fetch without a login', () => {
    const { result } = renderHook(() => useUserRepos(undefined), { wrapper: makeWrapper() })

    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('fetches the first repository page', async () => {
    const { result } = renderHook(() => useUserRepos('alice'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.data).toBeDefined())

    expect(result.current.data?.pages[0]).toHaveLength(2)
    expect(result.current.data?.pages[0][0].name).toBe('react-learning')
  })

  it('fetches the next repository page', async () => {
    const { result } = renderHook(() => useUserRepos('alice'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.hasNextPage).toBe(true))

    await result.current.fetchNextPage()

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2)
    })
    expect(result.current.data?.pages[1][0].name).toBe('second-page-repo')
    expect(result.current.hasNextPage).toBe(false)
  })

  it('sends the expected repository query params', async () => {
    let capturedUrl: URL | undefined

    server.use(
      http.get('https://api.github.com/users/:login/repos', ({ request }) => {
        capturedUrl = new URL(request.url)
        return HttpResponse.json([])
      }),
    )

    const { result } = renderHook(() => useUserRepos('alice'), { wrapper: makeWrapper() })

    await waitFor(() => expect(result.current.data).toBeDefined())

    expect(capturedUrl?.searchParams.get('per_page')).toBe('2')
    expect(capturedUrl?.searchParams.get('page')).toBe('1')
    expect(capturedUrl?.searchParams.get('sort')).toBe('updated')
  })
})

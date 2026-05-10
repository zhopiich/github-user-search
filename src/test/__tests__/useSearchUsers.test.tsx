import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useSearchUsers } from '@/features/search/hooks/useSearchUsers'

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('useSearchUsers', () => {
  it('returns data on success', async () => {
    const { result } = renderHook(() => useSearchUsers('react'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.data).toBeDefined())
    expect(result.current.data?.pages[0].items).toHaveLength(30)
    expect(result.current.data?.pages[0].items[0].login).toBe('alice')
  })

  it('does not fetch when query is empty', () => {
    const { result } = renderHook(() => useSearchUsers(''), { wrapper: makeWrapper() })
    expect(result.current.isFetching).toBe(false)
    expect(result.current.data).toBeUndefined()
  })

  it('does not fetch when query is whitespace only', () => {
    const { result } = renderHook(() => useSearchUsers('   '), { wrapper: makeWrapper() })
    expect(result.current.isFetching).toBe(false)
  })

  it('returns error on API failure', async () => {
    const { result } = renderHook(() => useSearchUsers('fail'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toMatch(/422/)
  })

  it('fetches the next search page', async () => {
    const { result } = renderHook(() => useSearchUsers('react'), { wrapper: makeWrapper() })
    await waitFor(() => expect(result.current.hasNextPage).toBe(true))

    await result.current.fetchNextPage()

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2)
    })
    expect(result.current.data?.pages[1].items[0].login).toBe('page-two-user')
    expect(result.current.hasNextPage).toBe(false)
  })
})

import { useCallback, useEffect, useState } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

const cache = new Map<string, unknown>()

function getCacheKey(url: string, token?: string) {
  return token ? `${url}::${token}` : url
}

export function useFetch<T>(url: string | null, token?: string) {
  const cacheKey = url ? getCacheKey(url, token) : null

  const [state, setState] = useState<FetchState<T>>(() => {
    if (cacheKey && cache.has(cacheKey))
      return { data: cache.get(cacheKey) as T, loading: false, error: null }
    return { data: null, loading: false, error: null }
  })

  const fetchData = useCallback(async (fetchUrl: string, signal: AbortSignal, authToken?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const headers: HeadersInit = authToken ? { Authorization: `Bearer ${authToken}` } : {}
      const res = await fetch(fetchUrl, { signal, headers })
      if (!res.ok)
        throw new Error(`GitHub API error: ${res.status}`)
      const data: T = await res.json()
      cache.set(getCacheKey(fetchUrl, authToken), data)
      setState({ data, loading: false, error: null })
    }
    catch (err) {
      if (!signal.aborted)
        setState(prev => ({ ...prev, loading: false, error: (err as Error).message }))
    }
  }, [])

  useEffect(() => {
    if (!url || !cacheKey)
      return
    if (cache.has(cacheKey))
      return

    const controller = new AbortController()
    fetchData(url, controller.signal, token)
    return () => controller.abort()
  }, [url, token, cacheKey, fetchData])

  return state
}

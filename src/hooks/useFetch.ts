import { useCallback, useEffect, useState } from 'react'

interface FetchState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const fetchData = useCallback(async (fetchUrl: string, signal: AbortSignal) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const res = await fetch(fetchUrl, { signal })
      if (!res.ok)
        throw new Error(`GitHub API error: ${res.status}`)
      const data: T = await res.json()
      setState({ data, loading: false, error: null })
    }
    catch (err) {
      if (!signal.aborted)
        setState(prev => ({ ...prev, loading: false, error: (err as Error).message }))
    }
  }, [])

  useEffect(() => {
    if (!url)
      return

    const controller = new AbortController()
    fetchData(url, controller.signal)
    return () => controller.abort()
  }, [url, fetchData])

  return state
}

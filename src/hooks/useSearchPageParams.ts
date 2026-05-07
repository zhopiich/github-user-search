import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'

const SEARCH_PARAM_QUERY = 'q'

export function useSearchPageParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get(SEARCH_PARAM_QUERY)?.trim() ?? ''

  const setQuery = useCallback((value: string) => {
    const nextQuery = value.trim()

    setSearchParams((current) => {
      const next = new URLSearchParams(current)

      if (nextQuery)
        next.set(SEARCH_PARAM_QUERY, nextQuery)
      else
        next.delete(SEARCH_PARAM_QUERY)

      return next
    }, { replace: true })
  }, [setSearchParams])

  return {
    query,
    setQuery,
  }
}

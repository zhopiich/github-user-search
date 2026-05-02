import { useQueryClient } from '@tanstack/react-query'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import TokenInput from '../components/TokenInput'
import UserCard from '../components/UserCard'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchUsers } from '../hooks/useSearchUsers'

const GRID_MIN_COLUMN_WIDTH = 160
const GRID_GAP = 16
const ESTIMATED_CARD_HEIGHT = 142
const ESTIMATED_ROW_HEIGHT = ESTIMATED_CARD_HEIGHT + GRID_GAP
const LOAD_MORE_ROW_THRESHOLD = 3

function getGridColumnCount(width: number) {
  if (width <= 0)
    return 1

  return Math.max(1, Math.floor((width + GRID_GAP) / (GRID_MIN_COLUMN_WIDTH + GRID_GAP)))
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [token, setToken] = useState('')
  const [columnCount, setColumnCount] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const debouncedQuery = useDebounce(query, 200)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSearchUsers(debouncedQuery, token || undefined)
  const users = data?.pages.flatMap(page => page.items) ?? []

  const rowCount = Math.ceil(users.length / columnCount)
  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 4,
    scrollMargin: gridRef.current?.offsetTop ?? 0,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const lastVirtualRowIndex = virtualRows.at(-1)?.index

  useEffect(() => {
    const grid = gridRef.current
    if (!grid)
      return

    const observer = new ResizeObserver(([entry]) => {
      setColumnCount((currentColumnCount) => {
        const nextColumnCount = getGridColumnCount(entry.contentRect.width)
        return currentColumnCount === nextColumnCount ? currentColumnCount : nextColumnCount
      })
    })

    observer.observe(grid)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    rowVirtualizer.measure()
  }, [columnCount, rowVirtualizer])

  useEffect(() => {
    if (
      lastVirtualRowIndex !== undefined
      && lastVirtualRowIndex >= rowCount - LOAD_MORE_ROW_THRESHOLD
      && hasNextPage
      && !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, lastVirtualRowIndex, rowCount])

  function handleQueryChange(value: string) {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  function handleTokenChange(value: string) {
    setToken(value)
    queryClient.cancelQueries({ queryKey: ['search-users'] })
    queryClient.cancelQueries({ queryKey: ['github-user'] })
    queryClient.removeQueries({ queryKey: ['search-users'] })
    queryClient.removeQueries({ queryKey: ['github-user'] })
  }

  return (
    <div className="page">
      <SearchBar value={query} onChange={handleQueryChange} />
      <TokenInput value={token} onChange={handleTokenChange} />

      {isLoading && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}
      {!isLoading && !isError && users.length === 0 && debouncedQuery.trim() && (
        <p className="status">No users found.</p>
      )}

      <div
        ref={gridRef}
        className="virtual-user-grid"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {virtualRows.map((virtualRow) => {
          const rowStart = virtualRow.index * columnCount
          const rowUsers = users.slice(rowStart, rowStart + columnCount)

          return (
            <div
              key={virtualRow.key}
              className="virtual-user-row"
              data-index={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              style={{
                transform: `translateY(${virtualRow.start - rowVirtualizer.options.scrollMargin}px)`,
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
              }}
            >
              {rowUsers.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )
        })}
      </div>

      {isFetchingNextPage && <p className="status">Loading more...</p>}
      {!isLoading && !isError && users.length > 0 && !hasNextPage && (
        <p className="status">End of results</p>
      )}
    </div>
  )
}

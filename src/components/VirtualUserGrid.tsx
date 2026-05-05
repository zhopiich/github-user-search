import type { GitHubUser } from '../types/github'
import { useWindowVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef, useState } from 'react'
import UserCard from './UserCard'
import { shouldLoadMoreGridPage } from './VirtualUserGrid.utils'

const GRID_MIN_COLUMN_WIDTH = 160
const GRID_GAP = 16
const ESTIMATED_CARD_HEIGHT = 142
const ESTIMATED_ROW_HEIGHT = ESTIMATED_CARD_HEIGHT + GRID_GAP

interface Props {
  users: GitHubUser[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}

function getGridColumnCount(width: number) {
  if (width <= 0)
    return 1

  return Math.max(1, Math.floor((width + GRID_GAP) / (GRID_MIN_COLUMN_WIDTH + GRID_GAP)))
}

export default function VirtualUserGrid({
  users,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: Props) {
  const [columnCount, setColumnCount] = useState(1)
  const gridRef = useRef<HTMLDivElement>(null)
  const rowCount = Math.ceil(users.length / columnCount)

  const rowVirtualizer = useWindowVirtualizer({
    count: rowCount,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: 4,
    scrollMargin: gridRef.current?.offsetTop ?? 0,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const lastVirtualRowIndex = virtualRows.at(-1)?.index
  const scrollMargin = rowVirtualizer.options.scrollMargin
  const shouldLoadMore = shouldLoadMoreGridPage({
    hasNextPage,
    isFetchingNextPage,
    lastVirtualRowIndex,
    rowCount,
    scrollMargin,
    scrollOffset: rowVirtualizer.scrollOffset,
  })

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
    if (shouldLoadMore)
      onLoadMore()
  }, [onLoadMore, shouldLoadMore])

  return (
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
  )
}

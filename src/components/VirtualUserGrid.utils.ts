const LOAD_MORE_ROW_THRESHOLD = 1

interface ShouldLoadMoreGridPageOptions {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  lastVirtualRowIndex: number | undefined
  rowCount: number
  scrollMargin: number
  scrollOffset: number | null
}

export function shouldLoadMoreGridPage({
  hasNextPage,
  isFetchingNextPage,
  lastVirtualRowIndex,
  rowCount,
  scrollMargin,
  scrollOffset,
}: ShouldLoadMoreGridPageOptions) {
  if (!hasNextPage || isFetchingNextPage)
    return false

  const hasScrolledIntoGrid = (scrollOffset ?? 0) > scrollMargin
  const isNearLastRow = (lastVirtualRowIndex ?? -1) >= rowCount - LOAD_MORE_ROW_THRESHOLD
  return hasScrolledIntoGrid && isNearLastRow
}

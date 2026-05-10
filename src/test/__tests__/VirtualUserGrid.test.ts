import { describe, expect, it } from 'vitest'
import { shouldLoadMoreGridPage } from '../../features/search/components/VirtualUserGrid.utils'

describe('virtualUserGrid', () => {
  it('does not load the next page before the user scrolls into the grid', () => {
    expect(shouldLoadMoreGridPage({
      hasNextPage: true,
      isFetchingNextPage: false,
      lastVirtualRowIndex: 9,
      rowCount: 10,
      scrollMargin: 120,
      scrollOffset: 0,
    })).toBe(false)
  })

  it('loads the next page when the user scrolls near the last row', () => {
    expect(shouldLoadMoreGridPage({
      hasNextPage: true,
      isFetchingNextPage: false,
      lastVirtualRowIndex: 9,
      rowCount: 10,
      scrollMargin: 120,
      scrollOffset: 480,
    })).toBe(true)
  })
})

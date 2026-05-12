import { beforeEach, describe, expect, it } from 'vitest'
import { useSearchNavigationStore } from '@/store/searchNavigationStore'

beforeEach(() => {
  useSearchNavigationStore.setState({ lastSearchQuery: '' })
})

describe('searchNavigationStore', () => {
  it('starts with no last search query', () => {
    expect(useSearchNavigationStore.getState().lastSearchQuery).toBe('')
  })

  it('sets a trimmed last search query', () => {
    useSearchNavigationStore.getState().setLastSearchQuery('  react  ')

    expect(useSearchNavigationStore.getState().lastSearchQuery).toBe('react')
  })

  it('ignores empty last search queries', () => {
    useSearchNavigationStore.getState().setLastSearchQuery('react')
    useSearchNavigationStore.getState().setLastSearchQuery('   ')

    expect(useSearchNavigationStore.getState().lastSearchQuery).toBe('react')
  })

  it('clears the last search query', () => {
    useSearchNavigationStore.getState().setLastSearchQuery('react')
    useSearchNavigationStore.getState().clearLastSearchQuery()

    expect(useSearchNavigationStore.getState().lastSearchQuery).toBe('')
  })
})

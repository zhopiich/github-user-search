import { beforeEach, describe, expect, it } from 'vitest'
import { useSearchHistoryStore } from '@/store/searchHistoryStore'

beforeEach(() => {
  localStorage.clear()
  useSearchHistoryStore.setState({
    recentSearches: [],
    rememberSearchHistory: false,
  })
})

describe('searchHistoryStore', () => {
  it('starts with no recent searches and persistence disabled', () => {
    expect(useSearchHistoryStore.getState().recentSearches).toEqual([])
    expect(useSearchHistoryStore.getState().rememberSearchHistory).toBe(false)
  })

  it('adds a trimmed search term to the front', () => {
    useSearchHistoryStore.getState().addSearch('  react  ')

    expect(useSearchHistoryStore.getState().recentSearches).toEqual(['react'])
  })

  it('ignores empty search terms', () => {
    useSearchHistoryStore.getState().addSearch('   ')

    expect(useSearchHistoryStore.getState().recentSearches).toEqual([])
  })

  it('deduplicates case-insensitively and moves the latest term to the front', () => {
    useSearchHistoryStore.getState().addSearch('react')
    useSearchHistoryStore.getState().addSearch('vue')
    useSearchHistoryStore.getState().addSearch('React')

    expect(useSearchHistoryStore.getState().recentSearches).toEqual(['React', 'vue'])
  })

  it('keeps only the five most recent searches', () => {
    for (const term of ['one', 'two', 'three', 'four', 'five', 'six'])
      useSearchHistoryStore.getState().addSearch(term)

    expect(useSearchHistoryStore.getState().recentSearches).toEqual([
      'six',
      'five',
      'four',
      'three',
      'two',
    ])
  })

  it('removes one search term', () => {
    useSearchHistoryStore.getState().addSearch('react')
    useSearchHistoryStore.getState().addSearch('vue')
    useSearchHistoryStore.getState().removeSearch('react')

    expect(useSearchHistoryStore.getState().recentSearches).toEqual(['vue'])
  })

  it('clears all recent searches', () => {
    useSearchHistoryStore.getState().addSearch('react')
    useSearchHistoryStore.getState().clearSearches()

    expect(useSearchHistoryStore.getState().recentSearches).toEqual([])
  })

  it('updates the persistence preference', () => {
    useSearchHistoryStore.getState().setRememberSearchHistory(true)

    expect(useSearchHistoryStore.getState().rememberSearchHistory).toBe(true)
  })
})

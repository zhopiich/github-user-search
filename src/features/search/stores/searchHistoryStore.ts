import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_RECENT_SEARCHES = 5

interface SearchHistoryStore {
  recentSearches: string[]
  rememberSearchHistory: boolean
  addSearch: (query: string) => void
  removeSearch: (query: string) => void
  clearSearches: () => void
  setRememberSearchHistory: (value: boolean) => void
}

function normalizeSearchTerm(query: string) {
  return query.trim()
}

function isSameSearchTerm(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase()
}

export const useSearchHistoryStore = create<SearchHistoryStore>()(
  persist(
    set => ({
      recentSearches: [],
      rememberSearchHistory: false,
      addSearch: query => set((state) => {
        const nextQuery = normalizeSearchTerm(query)

        if (!nextQuery)
          return state

        const deduped = state.recentSearches.filter(term => !isSameSearchTerm(term, nextQuery))

        return {
          recentSearches: [nextQuery, ...deduped].slice(0, MAX_RECENT_SEARCHES),
        }
      }),
      removeSearch: query => set(state => ({
        recentSearches: state.recentSearches.filter(term => !isSameSearchTerm(term, query)),
      })),
      clearSearches: () => set({ recentSearches: [] }),
      setRememberSearchHistory: value => set({ rememberSearchHistory: value }),
    }),
    {
      name: 'github-user-search:search-history',
      partialize: state =>
        state.rememberSearchHistory
          ? {
              recentSearches: state.recentSearches,
              rememberSearchHistory: state.rememberSearchHistory,
            }
          : { rememberSearchHistory: state.rememberSearchHistory },
    },
  ),
)

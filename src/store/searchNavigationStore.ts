import { create } from 'zustand'

interface SearchNavigationStore {
  lastSearchQuery: string
  setLastSearchQuery: (query: string) => void
  clearLastSearchQuery: () => void
}

export const useSearchNavigationStore = create<SearchNavigationStore>()(
  set => ({
    lastSearchQuery: '',
    setLastSearchQuery: query => set((state) => {
      const nextQuery = query.trim()

      if (!nextQuery)
        return state

      return { lastSearchQuery: nextQuery }
    }),
    clearLastSearchQuery: () => set({ lastSearchQuery: '' }),
  }),
)

import { useShallow } from 'zustand/react/shallow'
import { useSearchHistoryStore } from '@/features/search/stores/searchHistoryStore'
import { useAuthStore } from '@/store/authStore'
import { useFavoriteNotesStore } from '@/store/favoriteNotesStore'
import { useFavoritesStore } from '@/store/favoritesStore'

export function useTokenSettings() {
  return useAuthStore(useShallow(s => ({
    token: s.token,
    rememberToken: s.rememberToken,
    setToken: s.setToken,
    setRememberToken: s.setRememberToken,
    clearToken: s.clearToken,
  })))
}

export function useFavoritesDataSettings() {
  const favorites = useFavoritesStore(useShallow(s => ({
    clearFavorites: s.clearFavorites,
    replaceFavorites: s.replaceFavorites,
    exportFavorites: s.exportFavorites,
  })))
  const clearNotes = useFavoriteNotesStore(s => s.clearNotes)

  return {
    ...favorites,
    clearNotes,
  }
}

export function useSearchHistorySettings() {
  return useSearchHistoryStore(useShallow(s => ({
    rememberSearchHistory: s.rememberSearchHistory,
    setRememberSearchHistory: s.setRememberSearchHistory,
    clearSearches: s.clearSearches,
  })))
}

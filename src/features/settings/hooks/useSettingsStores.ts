import { useShallow } from 'zustand/react/shallow'
import { useAuthStore } from '../../../store/authStore'
import { useFavoritesStore } from '../../../store/favoritesStore'

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
  return useFavoritesStore(useShallow(s => ({
    clearFavorites: s.clearFavorites,
    replaceFavorites: s.replaceFavorites,
    exportFavorites: s.exportFavorites,
  })))
}

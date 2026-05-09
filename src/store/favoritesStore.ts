import type { GitHubUser } from '../types/github'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uniqueFavorites } from '../lib/favorites'

interface FavoritesStore {
  favorites: GitHubUser[]
  addFavorite: (user: GitHubUser) => void
  removeFavorite: (id: number) => void
  clearFavorites: () => void
  replaceFavorites: (favorites: GitHubUser[]) => void
  exportFavorites: () => string
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: user => set(s =>
        s.favorites.some(f => f.id === user.id) ? s : { favorites: [...s.favorites, user] },
      ),
      removeFavorite: id => set(s => ({ favorites: s.favorites.filter(u => u.id !== id) })),
      clearFavorites: () => set({ favorites: [] }),
      replaceFavorites: favorites => set({ favorites: uniqueFavorites(favorites) }),
      exportFavorites: () => JSON.stringify(get().favorites, null, 2),
    }),
    {
      name: 'github-user-search:favorites',
      partialize: state => ({ favorites: state.favorites }),
    },
  ),
)

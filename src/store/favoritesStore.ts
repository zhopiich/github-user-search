import type { GitHubUser } from '../types/github'
import { create } from 'zustand'

interface FavoritesStore {
  favorites: GitHubUser[]
  addFavorite: (user: GitHubUser) => void
  removeFavorite: (id: number) => void
}

export const useFavoritesStore = create<FavoritesStore>()(set => ({
  favorites: [],
  addFavorite: user => set(s =>
    s.favorites.some(f => f.id === user.id) ? s : { favorites: [...s.favorites, user] },
  ),
  removeFavorite: id => set(s => ({ favorites: s.favorites.filter(u => u.id !== id) })),
}))

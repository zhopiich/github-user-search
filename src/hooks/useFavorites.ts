import { use } from 'react'
import { FavoritesContext } from '../context/FavoritesContext'

export function useFavorites() {
  const ctx = use(FavoritesContext)
  if (!ctx)
    throw new Error('useFavorites must be used within FavoritesProvider')
  return ctx
}

import type { Dispatch, ReactNode } from 'react'
import type { GitHubUser } from '../types/github'
import type { Action } from './favoritesReducer'
import { createContext, useReducer } from 'react'
import { favoritesReducer } from './favoritesReducer'

interface FavoritesContextValue {
  favorites: GitHubUser[]
  dispatch: Dispatch<Action>
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, dispatch] = useReducer(favoritesReducer, [])

  return (
    <FavoritesContext value={{ favorites, dispatch }}>
      {children}
    </FavoritesContext>
  )
}

export { FavoritesContext }

import type { GitHubUser } from '../types/github'

export type Action
  = | { type: 'ADD_FAVORITE', payload: GitHubUser }
    | { type: 'REMOVE_FAVORITE', payload: number } // payload = user.id

export function favoritesReducer(state: GitHubUser[], action: Action): GitHubUser[] {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return [...state, action.payload]
    case 'REMOVE_FAVORITE':
      return state.filter(u => u.id !== action.payload)
  }
}

import type { GitHubUser } from '../types/github'

export function uniqueFavorites(favorites: GitHubUser[]) {
  const seen = new Set<number>()
  return favorites.filter((favorite) => {
    if (seen.has(favorite.id))
      return false

    seen.add(favorite.id)
    return true
  })
}

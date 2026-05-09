import type { GitHubUser } from '../types/github'

type ParseFavoriteUsersResult
  = | { ok: true, favorites: GitHubUser[] }
    | { ok: false, error: string }

function isGitHubUser(value: unknown): value is GitHubUser {
  if (!value || typeof value !== 'object')
    return false

  const candidate = value as Partial<GitHubUser>
  return (
    typeof candidate.id === 'number'
    && typeof candidate.login === 'string'
    && typeof candidate.avatar_url === 'string'
    && typeof candidate.html_url === 'string'
  )
}

function uniqueFavorites(favorites: GitHubUser[]) {
  const seen = new Set<number>()
  return favorites.filter((favorite) => {
    if (seen.has(favorite.id))
      return false

    seen.add(favorite.id)
    return true
  })
}

export function parseFavoriteUsers(value: string): ParseFavoriteUsersResult {
  let parsed: unknown

  try {
    parsed = JSON.parse(value)
  }
  catch {
    return { ok: false, error: 'Favorites import must be valid JSON.' }
  }

  if (!Array.isArray(parsed))
    return { ok: false, error: 'Favorites import must be an array.' }

  const favorites: GitHubUser[] = []

  for (const [index, item] of parsed.entries()) {
    if (!isGitHubUser(item))
      return { ok: false, error: `Favorite at index ${index + 1} is invalid.` }

    favorites.push(item)
  }

  return { ok: true, favorites: uniqueFavorites(favorites) }
}

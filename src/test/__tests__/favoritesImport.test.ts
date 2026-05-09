import { describe, expect, it } from 'vitest'
import { parseFavoriteUsers } from '../../lib/favoritesImport'

describe('parseFavoriteUsers', () => {
  it('rejects invalid JSON', () => {
    const result = parseFavoriteUsers('{')

    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(result.error).toBe('Favorites import must be valid JSON.')
  })

  it('rejects non-array JSON', () => {
    const result = parseFavoriteUsers('{}')

    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(result.error).toBe('Favorites import must be an array.')
  })

  it('rejects invalid user shape', () => {
    const result = parseFavoriteUsers(JSON.stringify([{ id: '1', login: 'alice' }]))

    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(result.error).toBe('Favorite at index 1 is invalid.')
  })

  it('returns de-duplicated users by id', () => {
    const result = parseFavoriteUsers(JSON.stringify([
      {
        id: 1,
        login: 'alice',
        avatar_url: 'https://avatars.githubusercontent.com/alice',
        html_url: 'https://github.com/alice',
      },
      {
        id: 1,
        login: 'alice-duplicate',
        avatar_url: 'https://avatars.githubusercontent.com/alice-duplicate',
        html_url: 'https://github.com/alice-duplicate',
      },
    ]))

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.favorites).toHaveLength(1)
      expect(result.favorites[0].login).toBe('alice')
    }
  })
})

import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoritesStore } from '@/store/favoritesStore'

const user1 = { id: 1, login: 'alice', avatar_url: '', html_url: '' }
const user2 = { id: 2, login: 'bob', avatar_url: '', html_url: '' }

beforeEach(() => {
  localStorage.clear()
  useFavoritesStore.setState({ favorites: [] })
})

describe('favoritesStore', () => {
  it('starts empty', () => {
    expect(useFavoritesStore.getState().favorites).toEqual([])
  })

  it('addFavorite adds a user', () => {
    useFavoritesStore.getState().addFavorite(user1)
    expect(useFavoritesStore.getState().favorites).toEqual([user1])
  })

  it('addFavorite ignores duplicate id', () => {
    useFavoritesStore.getState().addFavorite(user1)
    useFavoritesStore.getState().addFavorite(user1)
    expect(useFavoritesStore.getState().favorites).toHaveLength(1)
  })

  it('removeFavorite removes by id', () => {
    useFavoritesStore.getState().addFavorite(user1)
    useFavoritesStore.getState().addFavorite(user2)
    useFavoritesStore.getState().removeFavorite(1)
    expect(useFavoritesStore.getState().favorites).toEqual([user2])
  })

  it('removeFavorite is a no-op when id does not exist', () => {
    useFavoritesStore.getState().addFavorite(user1)
    useFavoritesStore.getState().removeFavorite(999)
    expect(useFavoritesStore.getState().favorites).toHaveLength(1)
  })

  it('clearFavorites empties favorites', () => {
    useFavoritesStore.getState().addFavorite(user1)
    useFavoritesStore.getState().clearFavorites()

    expect(useFavoritesStore.getState().favorites).toEqual([])
  })

  it('replaceFavorites de-duplicates by id', () => {
    useFavoritesStore.getState().replaceFavorites([user1, user1, user2])

    expect(useFavoritesStore.getState().favorites).toEqual([user1, user2])
  })

  it('exportFavorites returns formatted JSON', () => {
    useFavoritesStore.getState().replaceFavorites([user1])

    expect(useFavoritesStore.getState().exportFavorites()).toBe(JSON.stringify([user1], null, 2))
  })
})

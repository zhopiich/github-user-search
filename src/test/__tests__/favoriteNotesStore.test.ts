import { beforeEach, describe, expect, it } from 'vitest'
import { useFavoriteNotesStore } from '@/store/favoriteNotesStore'

beforeEach(() => {
  localStorage.clear()
  useFavoriteNotesStore.setState({ notesByUserId: {} })
})

describe('favoriteNotesStore', () => {
  it('starts empty', () => {
    expect(useFavoriteNotesStore.getState().notesByUserId).toEqual({})
  })

  it('sets a note for a user', () => {
    useFavoriteNotesStore.getState().setNote(1, 'Great React example')

    expect(useFavoriteNotesStore.getState().notesByUserId[1]).toMatchObject({
      userId: 1,
      body: 'Great React example',
    })
    expect(useFavoriteNotesStore.getState().notesByUserId[1].updatedAt).toEqual(expect.any(String))
  })

  it('trims note bodies before saving', () => {
    useFavoriteNotesStore.getState().setNote(1, '  useful profile  ')

    expect(useFavoriteNotesStore.getState().notesByUserId[1].body).toBe('useful profile')
  })

  it('updates an existing note', () => {
    useFavoriteNotesStore.getState().setNote(1, 'first')
    useFavoriteNotesStore.getState().setNote(1, 'second')

    expect(useFavoriteNotesStore.getState().notesByUserId[1].body).toBe('second')
  })

  it('removes a note', () => {
    useFavoriteNotesStore.getState().setNote(1, 'temporary')
    useFavoriteNotesStore.getState().removeNote(1)

    expect(useFavoriteNotesStore.getState().notesByUserId).toEqual({})
  })

  it('removes an existing note when saving an empty body', () => {
    useFavoriteNotesStore.getState().setNote(1, 'temporary')
    useFavoriteNotesStore.getState().setNote(1, '   ')

    expect(useFavoriteNotesStore.getState().notesByUserId).toEqual({})
  })

  it('clears all notes', () => {
    useFavoriteNotesStore.getState().setNote(1, 'one')
    useFavoriteNotesStore.getState().setNote(2, 'two')
    useFavoriteNotesStore.getState().clearNotes()

    expect(useFavoriteNotesStore.getState().notesByUserId).toEqual({})
  })
})

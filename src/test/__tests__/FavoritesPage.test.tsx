import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { useFavoriteNotesStore } from '@/store/favoriteNotesStore'
import { useFavoritesStore } from '@/store/favoritesStore'

const alice = {
  id: 1,
  login: 'alice',
  avatar_url: 'https://avatars.githubusercontent.com/alice',
  html_url: 'https://github.com/alice',
}

function renderFavoritesRoute() {
  window.history.pushState({}, '', '/favorites')
  return render(<App />)
}

beforeEach(() => {
  localStorage.clear()
  useFavoritesStore.setState({ favorites: [] })
  useFavoriteNotesStore.setState({ notesByUserId: {} })
  window.history.pushState({}, '', '/')
})

describe('favorites page notes', () => {
  it('opens the note editor only after add note is clicked', async () => {
    const user = userEvent.setup()
    useFavoritesStore.getState().replaceFavorites([alice])
    renderFavoritesRoute()

    expect(screen.queryByLabelText('Note for alice')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add note for alice' }))

    expect(screen.getByLabelText('Note for alice')).toBeInTheDocument()
  })

  it('saves a note for a favorite user and returns to summary view', async () => {
    const user = userEvent.setup()
    useFavoritesStore.getState().replaceFavorites([alice])
    renderFavoritesRoute()

    await user.click(screen.getByRole('button', { name: 'Add note for alice' }))
    await user.type(screen.getByLabelText('Note for alice'), 'Helpful React profile')
    await user.click(screen.getByRole('button', { name: 'Save note for alice' }))

    expect(useFavoriteNotesStore.getState().notesByUserId[1].body).toBe('Helpful React profile')
    expect(screen.queryByLabelText('Note for alice')).not.toBeInTheDocument()
    expect(screen.getByText('Helpful React profile')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit note for alice' })).toBeInTheDocument()
  })

  it('cancels a note edit and returns to summary view', async () => {
    const user = userEvent.setup()
    useFavoritesStore.getState().replaceFavorites([alice])
    useFavoriteNotesStore.getState().setNote(1, 'Original note')
    renderFavoritesRoute()

    await user.click(screen.getByRole('button', { name: 'Edit note for alice' }))
    const textarea = screen.getByLabelText('Note for alice')
    await user.clear(textarea)
    await user.type(textarea, 'Draft note')
    await user.click(screen.getByRole('button', { name: 'Cancel note edit for alice' }))

    expect(screen.queryByLabelText('Note for alice')).not.toBeInTheDocument()
    expect(screen.getByText('Original note')).toBeInTheDocument()
    expect(useFavoriteNotesStore.getState().notesByUserId[1].body).toBe('Original note')
  })

  it('removes a note when saving an empty value', async () => {
    const user = userEvent.setup()
    useFavoritesStore.getState().replaceFavorites([alice])
    useFavoriteNotesStore.getState().setNote(1, 'Remove me')
    renderFavoritesRoute()

    await user.click(screen.getByRole('button', { name: 'Edit note for alice' }))
    await user.clear(screen.getByLabelText('Note for alice'))
    await user.click(screen.getByRole('button', { name: 'Save note for alice' }))

    expect(useFavoriteNotesStore.getState().notesByUserId[1]).toBeUndefined()
    expect(screen.queryByLabelText('Note for alice')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add note for alice' })).toBeInTheDocument()
  })
})

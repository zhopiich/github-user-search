import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { useAuthStore } from '@/store/authStore'
import { useFavoriteNotesStore } from '@/store/favoriteNotesStore'
import { useFavoritesStore } from '@/store/favoritesStore'

function renderSettingsRoute() {
  window.history.pushState({}, '', '/settings')
  return render(<App />)
}

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({ token: '', rememberToken: false })
  useFavoritesStore.setState({ favorites: [] })
  useFavoriteNotesStore.setState({ notesByUserId: {} })
  window.history.pushState({}, '', '/')
})

describe('settings page', () => {
  it('renders from the settings route', () => {
    renderSettingsRoute()

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveClass('active')
  })

  it('updates token from the token input', async () => {
    const user = userEvent.setup()
    renderSettingsRoute()

    await user.type(screen.getByLabelText('GitHub token'), 'abc123')

    expect(useAuthStore.getState().token).toBe('abc123')
  })

  it('persists token only after remember is enabled', async () => {
    const user = userEvent.setup()
    renderSettingsRoute()

    await user.type(screen.getByLabelText('GitHub token'), 'abc123')
    expect(localStorage.getItem('github-user-search:auth')).toBeNull()

    await user.click(screen.getByRole('checkbox', { name: 'Remember token on this device' }))

    expect(JSON.parse(localStorage.getItem('github-user-search:auth') ?? '{}')).toEqual({
      rememberToken: true,
      token: 'abc123',
    })
  })

  it('clears the token', async () => {
    const user = userEvent.setup()
    useAuthStore.getState().setToken('abc123')
    renderSettingsRoute()

    await user.click(screen.getByRole('button', { name: 'Clear token' }))

    expect(useAuthStore.getState().token).toBe('')
    expect(screen.getByLabelText('GitHub token')).toHaveValue('')
  })

  it('exports favorites as JSON', async () => {
    const user = userEvent.setup()
    useFavoritesStore.getState().replaceFavorites([{
      id: 1,
      login: 'alice',
      avatar_url: 'https://avatars.githubusercontent.com/alice',
      html_url: 'https://github.com/alice',
    }])
    renderSettingsRoute()

    await user.click(screen.getByRole('button', { name: 'Export favorites' }))

    expect(screen.getByLabelText('Favorites JSON')).toHaveValue(useFavoritesStore.getState().exportFavorites())
  })

  it('shows an error for invalid favorites import', async () => {
    const user = userEvent.setup()
    renderSettingsRoute()

    fireEvent.change(screen.getByLabelText('Favorites JSON'), { target: { value: '{' } })
    await user.click(screen.getByRole('button', { name: 'Import favorites' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Favorites import must be valid JSON.')
    expect(useFavoritesStore.getState().favorites).toEqual([])
  })

  it('imports valid favorites JSON', async () => {
    const user = userEvent.setup()
    renderSettingsRoute()

    fireEvent.change(screen.getByLabelText('Favorites JSON'), { target: { value: JSON.stringify([{
      id: 1,
      login: 'alice',
      avatar_url: 'https://avatars.githubusercontent.com/alice',
      html_url: 'https://github.com/alice',
    }]) } })
    await user.click(screen.getByRole('button', { name: 'Import favorites' }))

    expect(useFavoritesStore.getState().favorites).toHaveLength(1)
    expect(screen.getByText('Imported 1 favorite.')).toBeInTheDocument()
  })

  it('clears favorite notes when favorites are cleared', async () => {
    const user = userEvent.setup()
    useFavoritesStore.getState().replaceFavorites([{
      id: 1,
      login: 'alice',
      avatar_url: 'https://avatars.githubusercontent.com/alice',
      html_url: 'https://github.com/alice',
    }])
    useFavoriteNotesStore.getState().setNote(1, 'Local note')
    renderSettingsRoute()

    await user.click(screen.getByRole('button', { name: 'Clear favorites' }))

    expect(useFavoritesStore.getState().favorites).toEqual([])
    expect(useFavoriteNotesStore.getState().notesByUserId).toEqual({})
  })

  it('hydrates remembered token when the app starts', () => {
    localStorage.setItem('github-user-search:auth', JSON.stringify({
      rememberToken: true,
      token: 'stored-token',
    }))

    renderSettingsRoute()

    expect(screen.getByLabelText('GitHub token')).toHaveValue('stored-token')
    expect(screen.getByRole('checkbox', { name: 'Remember token on this device' })).toBeChecked()
  })
})

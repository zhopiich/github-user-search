import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import UserCard from '@/components/UserCard'
import { useFavoritesStore } from '@/store/favoritesStore'

const mockUser = {
  id: 1,
  login: 'alice',
  avatar_url: 'https://example.com/avatar.jpg',
  html_url: 'https://github.com/alice',
}

function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

function renderCard() {
  return render(
    <MemoryRouter>
      <UserCard user={mockUser} />
      <LocationDisplay />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] })
})

describe('userCard', () => {
  it('renders login name', () => {
    renderCard()
    expect(screen.getByText('alice')).toBeInTheDocument()
  })

  it('adds to favorites when star is clicked', async () => {
    renderCard()
    await userEvent.click(screen.getByRole('button'))
    expect(useFavoritesStore.getState().favorites).toHaveLength(1)
    expect(useFavoritesStore.getState().favorites[0].id).toBe(1)
  })

  it('removes from favorites on second click', async () => {
    useFavoritesStore.setState({ favorites: [mockUser] })
    renderCard()
    await userEvent.click(screen.getByRole('button'))
    expect(useFavoritesStore.getState().favorites).toHaveLength(0)
  })

  it('shows favorited style when already in favorites', () => {
    useFavoritesStore.setState({ favorites: [mockUser] })
    renderCard()
    expect(screen.getByRole('button')).toHaveClass('favorited')
  })

  it('does not show favorited style when not in favorites', () => {
    renderCard()
    expect(screen.getByRole('button')).not.toHaveClass('favorited')
  })

  it('navigates to user detail page on card click', async () => {
    renderCard()
    await userEvent.click(screen.getByRole('link'))
    expect(screen.getByTestId('location').textContent).toBe('/user/alice')
  })

  it('does not navigate when star button is clicked', async () => {
    renderCard()
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByTestId('location').textContent).toBe('/')
  })
})

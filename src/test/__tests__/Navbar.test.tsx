import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import Navbar from '@/components/Navbar'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useSearchNavigationStore } from '@/store/searchNavigationStore'

function renderNavbar() {
  return render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>,
  )
}

beforeEach(() => {
  useFavoritesStore.setState({ favorites: [] })
  useSearchNavigationStore.setState({ lastSearchQuery: '' })
})

describe('navbar', () => {
  it('links Search to the empty search page when there is no last search query', () => {
    renderNavbar()

    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/')
  })

  it('links Search to the last successful search query', () => {
    useSearchNavigationStore.getState().setLastSearchQuery('react router')
    renderNavbar()

    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute(
      'href',
      '/?q=react%20router',
    )
  })
})

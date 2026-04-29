import type { SearchResult } from './types/github'
import { useState } from 'react'
import SearchBar from './components/SearchBar'
import TokenInput from './components/TokenInput'
import UserCard from './components/UserCard'
import { FavoritesProvider } from './context/FavoritesContext'
import { useDebounce } from './hooks/useDebounce'
import { useFavorites } from './hooks/useFavorites'
import { useFetch } from './hooks/useFetch'
import './App.css'

type Tab = 'search' | 'favorites'

function AppContent() {
  const [tab, setTab] = useState<Tab>('search')
  const [query, setQuery] = useState('')
  const [token, setToken] = useState('')
  const { favorites } = useFavorites()

  const debouncedQuery = useDebounce(query, 200)
  const url = debouncedQuery.trim()
    ? `https://api.github.com/search/users?q=${encodeURIComponent(debouncedQuery)}&per_page=12`
    : null

  const { data, loading, error } = useFetch<SearchResult>(url, token || undefined)
  const users = data?.items ?? []

  return (
    <div className="app">
      <h1>GitHub User Search</h1>

      <div className="tabs">
        <button
          type="button"
          className={tab === 'search' ? 'active' : ''}
          onClick={() => setTab('search')}
        >
          Search
        </button>
        <button
          type="button"
          className={tab === 'favorites' ? 'active' : ''}
          onClick={() => setTab('favorites')}
        >
          Favorites
          {favorites.length > 0 && (
            <span className="badge">{favorites.length}</span>
          )}
        </button>
      </div>

      {tab === 'search' && (
        <>
          <SearchBar value={query} onChange={setQuery} />
          <TokenInput value={token} onChange={setToken} />

          {loading && <p className="status">Loading...</p>}
          {error && <p className="status error">{error}</p>}
          {!loading && !error && users.length === 0 && debouncedQuery.trim() && (
            <p className="status">No users found.</p>
          )}

          <div className="user-grid">
            {users.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </>
      )}

      {tab === 'favorites' && (
        <>
          {favorites.length === 0
            ? <p className="status">No favorites yet.</p>
            : (
                <div className="user-grid">
                  {favorites.map(user => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </div>
              )}
        </>
      )}
    </div>
  )
}

export default function App() {
  return (
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  )
}

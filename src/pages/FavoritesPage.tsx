import type { GitHubUser } from '../types/github'
import { useMemo, useState } from 'react'
import UserCard from '../components/UserCard'
import { useFavoritesStore } from '../store/favoritesStore'

interface FavoritesContentProps {
  favorites: GitHubUser[]
  filtered: GitHubUser[]
}

function FavoritesContent({ favorites, filtered }: FavoritesContentProps) {
  if (favorites.length === 0) {
    return <p className="status">No favorites yet.</p>
  }
  if (filtered.length === 0) {
    return <p className="status">No matches.</p>
  }
  return (
    <div className="user-grid">
      {filtered.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  )
}

export default function FavoritesPage() {
  const favorites = useFavoritesStore(s => s.favorites)
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => {
      if (favorites.length <= 1)
        return favorites
      return favorites.filter(u => u.login.toLowerCase().includes(search.toLowerCase()))
    },
    [favorites, search],
  )

  return (
    <div className="page">
      {favorites.length > 1 && (
        <input
          className="filter-input"
          type="text"
          placeholder="Filter favorites..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      )}

      <FavoritesContent favorites={favorites} filtered={filtered} />
    </div>
  )
}

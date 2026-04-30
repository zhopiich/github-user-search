import { useMemo, useState } from 'react'
import UserCard from '../components/UserCard'
import { useFavorites } from '../hooks/useFavorites'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () => favorites.filter(u => u.login.toLowerCase().includes(search.toLowerCase())),
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

      {favorites.length === 0
        ? <p className="status">No favorites yet.</p>
        : filtered.length === 0
          ? <p className="status">No matches.</p>
          : (
              <div className="user-grid">
                {filtered.map(user => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            )}
    </div>
  )
}

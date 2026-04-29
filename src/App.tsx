import type { GitHubUser, SearchResult } from './types/github'
import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import UserCard from './components/UserCard'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<GitHubUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query.trim()) {
      setUsers([])
      return
    }

    setLoading(true)
    setError(null)

    fetch(`https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=12`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`GitHub API error: ${res.status}`)
        return res.json() as Promise<SearchResult>
      })
      .then(data => setUsers(data.items))
      .catch(err => setError((err as Error).message))
      .finally(() => setLoading(false))
  }, [query])

  return (
    <div className="app">
      <h1>GitHub User Search</h1>
      <SearchBar value={query} onChange={setQuery} />

      {loading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && users.length === 0 && query.trim() && (
        <p className="status">No users found.</p>
      )}

      <div className="user-grid">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  )
}

export default App

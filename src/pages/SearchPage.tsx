import type { SearchResult } from '../types/github'
import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import TokenInput from '../components/TokenInput'
import UserCard from '../components/UserCard'
import { useDebounce } from '../hooks/useDebounce'
import { useFetch } from '../hooks/useFetch'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [token, setToken] = useState('')

  const debouncedQuery = useDebounce(query, 200)
  const url = debouncedQuery.trim()
    ? `https://api.github.com/search/users?q=${encodeURIComponent(debouncedQuery)}&per_page=12`
    : null

  const { data, loading, error } = useFetch<SearchResult>(url, token || undefined)
  const users = data?.items ?? []

  return (
    <div className="page">
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
    </div>
  )
}

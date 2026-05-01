import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import TokenInput from '../components/TokenInput'
import UserCard from '../components/UserCard'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchUsers } from '../hooks/useSearchUsers'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const [token, setToken] = useState('')

  const debouncedQuery = useDebounce(query, 200)
  const { data, isFetching, isError, error } = useSearchUsers(debouncedQuery, token || undefined)
  const users = data?.items ?? []

  function handleQueryChange(value: string) {
    setSearchParams(value ? { q: value } : {}, { replace: true })
  }

  return (
    <div className="page">
      <SearchBar value={query} onChange={handleQueryChange} />
      <TokenInput value={token} onChange={setToken} />

      {isFetching && <p className="status">Loading...</p>}
      {isError && <p className="status error">{error.message}</p>}
      {!isFetching && !isError && users.length === 0 && debouncedQuery.trim() && (
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

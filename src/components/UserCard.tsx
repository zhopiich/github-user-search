import type { GitHubUser } from '../types/github'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

interface Props {
  user: GitHubUser
}

function UserCard({ user }: Props) {
  const { favorites, dispatch } = useFavorites()
  const isFavorited = favorites.some(f => f.id === user.id)

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault() // prevent the outer <Link> from triggering navigation
    dispatch(
      isFavorited
        ? { type: 'REMOVE_FAVORITE', payload: user.id }
        : { type: 'ADD_FAVORITE', payload: user },
    )
  }

  return (
    <Link className="user-card" to={`/user/${user.login}`}>
      <button
        type="button"
        className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
        onClick={toggleFavorite}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        ★
      </button>
      <img src={user.avatar_url} alt={user.login} width={64} height={64} />
      <span className="login">{user.login}</span>
    </Link>
  )
}

export default memo(UserCard)

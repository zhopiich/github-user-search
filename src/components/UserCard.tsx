import type { GitHubUser } from '@/types/github'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useFavoritesStore } from '@/store/favoritesStore'

interface Props {
  user: GitHubUser
}

function UserCard({ user }: Props) {
  const isFavorited = useFavoritesStore(s => s.favorites.some(f => f.id === user.id))
  const addFavorite = useFavoritesStore(s => s.addFavorite)
  const removeFavorite = useFavoritesStore(s => s.removeFavorite)

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault() // prevent the outer <Link> from triggering navigation
    if (isFavorited) {
      removeFavorite(user.id)
    }
    else {
      addFavorite(user)
    }
  }

  return (
    <Link className="user-card" to={`/user/${user.login}`}>
      <button
        type="button"
        className={`user-card-favorite-button ${isFavorited ? 'favorited' : ''}`}
        onClick={toggleFavorite}
        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        ★
      </button>
      <img src={user.avatar_url} alt={user.login} width={64} height={64} />
      <span className="user-card-login">{user.login}</span>
    </Link>
  )
}

export default memo(UserCard)

import type { GitHubUser } from '../types/github'
import { useFavorites } from '../hooks/useFavorites'

interface Props {
  user: GitHubUser
}

export default function UserCard({ user }: Props) {
  const { favorites, dispatch } = useFavorites()
  const isFavorited = favorites.some(f => f.id === user.id)

  function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault() // prevent the outer <a> tag from triggering navigation
    dispatch(
      isFavorited
        ? { type: 'REMOVE_FAVORITE', payload: user.id }
        : { type: 'ADD_FAVORITE', payload: user },
    )
  }

  return (
    <a
      className="user-card"
      href={user.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
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
    </a>
  )
}

import { Link, useParams } from 'react-router-dom'
import { useGitHubUser } from '../hooks/useGitHubUser'

export default function UserDetailPage() {
  const { login } = useParams<{ login: string }>()
  const { data: user, isPending, isError, error } = useGitHubUser(login)

  if (isPending)
    return <p className="status">Loading...</p>
  if (isError)
    return <p className="status error">{error.message}</p>
  if (!user)
    return null

  return (
    <div className="page user-detail">
      <Link to="/" className="back-link">← Back to search</Link>
      <div className="detail-card">
        <img src={user.avatar_url} alt={user.login} width={120} height={120} />
        <div className="detail-info">
          <h2>{user.name ?? user.login}</h2>
          {user.name && (
            <p className="login-sub">
              @
              {user.login}
            </p>
          )}
          {user.bio && <p className="bio">{user.bio}</p>}
          {user.location && (
            <p className="meta">
              📍
              {user.location}
            </p>
          )}
          {user.blog && (
            <p className="meta">
              🔗
              {' '}
              <a href={user.blog} target="_blank" rel="noopener noreferrer">{user.blog}</a>
            </p>
          )}
          <div className="stats">
            <span>
              <strong>{user.public_repos}</strong>
              {' '}
              repos
            </span>
            <span>
              <strong>{user.followers}</strong>
              {' '}
              followers
            </span>
            <span>
              <strong>{user.following}</strong>
              {' '}
              following
            </span>
          </div>
          <a className="gh-link" href={user.html_url} target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}

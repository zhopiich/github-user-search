import { useParams } from 'react-router-dom'
import { useSuspenseGitHubUser } from '../hooks/useGitHubUser'

export default function UserDetailPage() {
  const { login } = useParams<{ login: string }>()

  if (!login)
    throw new Error('Missing GitHub login')

  const { data: user } = useSuspenseGitHubUser(login)

  return (
    <div className="page user-detail">
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

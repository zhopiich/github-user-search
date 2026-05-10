import type { GitHubUserDetail } from '../../../types/github'
import { NavLink, Outlet } from 'react-router-dom'

export interface UserDetailOutletContext {
  user: GitHubUserDetail
}

interface UserDetailLayoutProps {
  user: GitHubUserDetail
}

export default function UserDetailLayout({ user }: UserDetailLayoutProps) {
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

      <nav className="tabs" aria-label="User detail tabs">
        <NavLink end to={`/user/${user.login}`}>Overview</NavLink>
        <NavLink to={`/user/${user.login}/repos`}>Repos</NavLink>
      </nav>

      <Outlet context={{ user } satisfies UserDetailOutletContext} />
    </div>
  )
}

import type { GitHubRepository } from '@/types/github'
import { Link } from 'react-router-dom'

interface UserReposPanelProps {
  login: string
  repos: GitHubRepository[]
  hasNextPage: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value))
}

export default function UserReposPanel({
  login,
  repos,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: UserReposPanelProps) {
  if (repos.length === 0)
    return <p className="status">No public repositories.</p>

  let loadMoreLabel = 'Load more repositories'
  if (isFetchingNextPage)
    loadMoreLabel = 'Loading repositories...'

  return (
    <section className="user-tab-panel repo-list" aria-label="User repositories">
      <ul>
        {repos.map(repo => (
          <li key={repo.id} className="repo-list-item">
            <Link to={`/user/${login}/repos/${encodeURIComponent(repo.name)}`}>{repo.name}</Link>
            {repo.description && <p>{repo.description}</p>}
            <div className="repo-meta">
              {repo.language && <span>{repo.language}</span>}
              <span>
                Stars
                {' '}
                {repo.stargazers_count}
              </span>
              <span>
                Forks
                {' '}
                {repo.forks_count}
              </span>
              <span>
                Updated
                {' '}
                {formatUpdatedAt(repo.updated_at)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <button
          className="retry-button"
          type="button"
          disabled={isFetchingNextPage}
          onClick={onLoadMore}
        >
          {loadMoreLabel}
        </button>
      )}
      {!hasNextPage && <p className="status">End of repositories</p>}
    </section>
  )
}

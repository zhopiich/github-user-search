import type { GitHubRepository } from '@/types/github'
import { formatUpdatedAt } from '@/lib/dateFormat'

interface RepositoryDetailPanelProps {
  repository: GitHubRepository
}

export default function RepositoryDetailPanel({ repository }: RepositoryDetailPanelProps) {
  return (
    <section className="user-tab-panel user-repo-detail-panel" aria-label="Repository detail">
      <div>
        <h3>{repository.name}</h3>
        {repository.description && <p>{repository.description}</p>}
      </div>

      <dl className="user-repo-detail-list">
        {repository.language && (
          <>
            <dt>Language</dt>
            <dd>{repository.language}</dd>
          </>
        )}
        <dt>Stars</dt>
        <dd>{repository.stargazers_count}</dd>
        <dt>Forks</dt>
        <dd>{repository.forks_count}</dd>
        <dt>Open issues</dt>
        <dd>{repository.open_issues_count}</dd>
        <dt>Default branch</dt>
        <dd>
          Default branch
          {' '}
          {repository.default_branch}
        </dd>
        <dt>Updated</dt>
        <dd>{formatUpdatedAt(repository.updated_at)}</dd>
      </dl>

      <a className="user-github-link" href={repository.html_url} target="_blank" rel="noopener noreferrer">
        View repository on GitHub
      </a>
    </section>
  )
}

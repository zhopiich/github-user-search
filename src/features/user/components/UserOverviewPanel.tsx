import type { GitHubUserDetail } from '@/types/github'

interface UserOverviewPanelProps {
  user: GitHubUserDetail
}

export default function UserOverviewPanel({ user }: UserOverviewPanelProps) {
  return (
    <section className="user-tab-panel" aria-label="User overview">
      {user.bio ? <p className="user-bio">{user.bio}</p> : <p className="status">No bio provided.</p>}
      {user.location && (
        <p className="user-meta">
          📍
          {user.location}
        </p>
      )}
      {user.blog && (
        <p className="user-meta">
          🔗
          {' '}
          <a href={user.blog} target="_blank" rel="noopener noreferrer">{user.blog}</a>
        </p>
      )}
    </section>
  )
}

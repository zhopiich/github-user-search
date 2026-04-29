import type { GitHubUser } from '../types/github'

interface Props {
  user: GitHubUser
}

export default function UserCard({ user }: Props) {
  return (
    <a
      className="user-card"
      href={user.html_url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={user.avatar_url} alt={user.login} width={64} height={64} />
      <span className="login">{user.login}</span>
    </a>
  )
}

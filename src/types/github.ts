export interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  html_url: string
}

export interface GitHubUserDetail extends GitHubUser {
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  blog: string | null
  location: string | null
}

export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  open_issues_count: number
  default_branch: string
}

export interface SearchResult {
  total_count: number
  items: GitHubUser[]
}

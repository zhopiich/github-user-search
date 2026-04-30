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

export interface SearchResult {
  total_count: number
  items: GitHubUser[]
}

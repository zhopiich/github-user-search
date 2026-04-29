export interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  html_url: string
}

export interface SearchResult {
  total_count: number
  items: GitHubUser[]
}

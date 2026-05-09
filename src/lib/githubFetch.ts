import { createHttpClient } from './httpClient'

let client = createGithubFetch()

// Intentionally do not pass TanStack Query's AbortSignal here. In React StrictMode,
// the development-only mount/unmount/remount cycle can abort the first fetch and
// trigger a second GitHub request. These GET requests are safe to finish and populate
// the query cache.
export function createGithubFetch(options?: { token?: string }) {
  const headers: HeadersInit = options?.token ? { Authorization: `Bearer ${options.token}` } : {}
  return createHttpClient({ baseURL: 'https://api.github.com', headers })
}

export function setGithubFetch(token?: string) {
  client = createGithubFetch({ token })
}

export function githubFetch() {
  return client
}

export async function githubFetch<T>(url: string, token?: string): Promise<T> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  // Intentionally do not pass TanStack Query's AbortSignal here. In React StrictMode,
  // the development-only mount/unmount/remount cycle can abort the first fetch and
  // trigger a second GitHub request. These GET requests are safe to finish and populate
  // the query cache, which is a better trade-off for GitHub API rate limits.
  const res = await fetch(url, { headers })
  if (!res.ok)
    throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

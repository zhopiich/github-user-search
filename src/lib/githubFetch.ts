export async function githubFetch<T>(url: string, token?: string, signal?: AbortSignal): Promise<T> {
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}
  const res = await fetch(url, { headers, signal })
  if (!res.ok)
    throw new Error(`GitHub API error: ${res.status}`)
  return res.json()
}

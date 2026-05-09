type Json
  = | string
    | number
    | boolean
    | null
    | Json[]
    | { [key: string]: Json }

interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
}

export function createHttpClient(config: { baseURL?: string, headers?: Record<string, string> } = {}) {
  const baseURL = config.baseURL ?? ''
  const defaultHeaders = config.headers ?? {}

  async function request<T>(
    method: string,
    url: string,
    body?: Json,
    { headers = {}, params }: RequestOptions = {},
  ): Promise<T> {
    const fullURL = new URL(baseURL + url)

    if (params) {
      Object.entries(params).forEach(([k, v]) => fullURL.searchParams.set(k, String(v)))
    }

    const response = await fetch(fullURL, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders,
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      (error as any).status = response.status
      throw error
    }

    return response.json()
  }

  return {
    get: <T>(url: string, options?: RequestOptions) => request<T>('GET', url, undefined, options),
    post: <T>(url: string, body?: Json, options?: RequestOptions) => request<T>('POST', url, body, options),
  }
}

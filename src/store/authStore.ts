import { create } from 'zustand'
import { setGithubFetch } from '../lib/githubFetch'

const AUTH_STORAGE_KEY = 'github-user-search:auth'

interface StoredAuth {
  rememberToken: boolean
  token: string
}

interface AuthStore {
  token: string
  rememberToken: boolean
  setToken: (token: string) => void
  setRememberToken: (rememberToken: boolean) => void
  clearToken: () => void
  hydrateToken: () => void
}

function isStoredAuth(value: unknown): value is StoredAuth {
  if (!value || typeof value !== 'object')
    return false

  const candidate = value as Partial<StoredAuth>
  return candidate.rememberToken === true && typeof candidate.token === 'string'
}

function writeStoredAuth(token: string) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    rememberToken: true,
    token,
  }))
}

function removeStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: '',
  rememberToken: false,

  setToken: (token) => {
    if (get().token === token)
      return

    setGithubFetch(token)

    if (get().rememberToken)
      writeStoredAuth(token)

    set({ token })
  },

  setRememberToken: (rememberToken) => {
    if (rememberToken) {
      writeStoredAuth(get().token)
      set({ rememberToken: true })
      return
    }

    removeStoredAuth()
    set({ rememberToken: false })
  },

  clearToken: () => {
    removeStoredAuth()
    setGithubFetch(undefined)
    set({ token: '', rememberToken: false })
  },

  hydrateToken: () => {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)

    if (!raw)
      return

    try {
      const parsed: unknown = JSON.parse(raw)

      if (!isStoredAuth(parsed)) {
        removeStoredAuth()
        return
      }

      setGithubFetch(parsed.token)
      set({ token: parsed.token, rememberToken: true })
    }
    catch {
      removeStoredAuth()
    }
  },
}))

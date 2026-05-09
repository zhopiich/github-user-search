import { create } from 'zustand'
import { setGithubFetch } from '../lib/githubFetch'

interface AuthStore {
  token: string
  setToken: (token: string) => void
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: '',

  setToken: (token) => {
    if (get().token === token)
      return

    setGithubFetch(token) // before re-render
    set({ token })
  },
}))

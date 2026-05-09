import { beforeEach, describe, expect, it } from 'vitest'
import { useAuthStore } from '../../store/authStore'

const AUTH_STORAGE_KEY = 'github-user-search:auth'

beforeEach(() => {
  localStorage.clear()
  useAuthStore.setState({
    token: '',
    rememberToken: false,
  })
})

describe('authStore', () => {
  it('starts with an empty memory-only token', () => {
    expect(useAuthStore.getState().token).toBe('')
    expect(useAuthStore.getState().rememberToken).toBe(false)
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('sets token in memory without writing localStorage by default', () => {
    useAuthStore.getState().setToken('abc123')

    expect(useAuthStore.getState().token).toBe('abc123')
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('writes the current token when rememberToken is enabled', () => {
    useAuthStore.getState().setToken('abc123')
    useAuthStore.getState().setRememberToken(true)

    expect(JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? '{}')).toEqual({
      rememberToken: true,
      token: 'abc123',
    })
  })

  it('updates stored token while rememberToken is enabled', () => {
    useAuthStore.getState().setRememberToken(true)
    useAuthStore.getState().setToken('next-token')

    expect(JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY) ?? '{}')).toEqual({
      rememberToken: true,
      token: 'next-token',
    })
  })

  it('removes stored token but preserves memory token when rememberToken is disabled', () => {
    useAuthStore.getState().setToken('abc123')
    useAuthStore.getState().setRememberToken(true)

    useAuthStore.getState().setRememberToken(false)

    expect(useAuthStore.getState().token).toBe('abc123')
    expect(useAuthStore.getState().rememberToken).toBe(false)
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('clears memory token and localStorage token', () => {
    useAuthStore.getState().setToken('abc123')
    useAuthStore.getState().setRememberToken(true)

    useAuthStore.getState().clearToken()

    expect(useAuthStore.getState().token).toBe('')
    expect(useAuthStore.getState().rememberToken).toBe(false)
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('hydrates a valid remembered token', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      rememberToken: true,
      token: 'stored-token',
    }))

    useAuthStore.getState().hydrateToken()

    expect(useAuthStore.getState().token).toBe('stored-token')
    expect(useAuthStore.getState().rememberToken).toBe(true)
  })

  it('removes invalid stored auth data during hydration', () => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
      rememberToken: true,
      token: 123,
    }))

    useAuthStore.getState().hydrateToken()

    expect(useAuthStore.getState().token).toBe('')
    expect(useAuthStore.getState().rememberToken).toBe(false)
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })
})

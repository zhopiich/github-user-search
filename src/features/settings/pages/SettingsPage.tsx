import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useFavoritesDataSettings, useTokenSettings } from '../hooks/useSettingsStores'
import { parseFavoriteUsers } from '../lib/favoritesImport'

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const {
    token,
    rememberToken,
    setToken,
    setRememberToken,
    clearToken,
  } = useTokenSettings()
  const {
    clearFavorites,
    replaceFavorites,
    exportFavorites,
    clearNotes,
  } = useFavoritesDataSettings()
  const [showToken, setShowToken] = useState(false)
  const [favoritesJson, setFavoritesJson] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function clearFeedback() {
    setMessage('')
    setError('')
  }

  function handleClearCache() {
    queryClient.removeQueries({ queryKey: ['search-users'] })
    queryClient.removeQueries({ queryKey: ['github-user'] })
    queryClient.removeQueries({ queryKey: ['github-user-repos'] })
    setError('')
    setMessage('API cache cleared.')
  }

  function handleExportFavorites() {
    clearFeedback()
    setFavoritesJson(exportFavorites())
    setMessage('Favorites exported.')
  }

  function handleImportFavorites() {
    clearFeedback()
    const result = parseFavoriteUsers(favoritesJson)

    if (!result.ok) {
      setError(result.error)
      return
    }

    replaceFavorites(result.favorites)
    setMessage(`Imported ${result.favorites.length} ${result.favorites.length === 1 ? 'favorite' : 'favorites'}.`)
  }

  function handleClearFavorites() {
    clearFeedback()
    clearFavorites()
    clearNotes()
    setFavoritesJson('')
    setMessage('Favorites cleared.')
  }

  return (
    <div className="page settings-page">
      <h2>Settings</h2>

      <section className="settings-section">
        <h3>GitHub Token</h3>
        <label className="settings-field">
          <span>GitHub token</span>
          <input
            aria-label="GitHub token"
            type={showToken ? 'text' : 'password'}
            value={token}
            onChange={e => setToken(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={showToken}
            onChange={e => setShowToken(e.target.checked)}
          />
          Show token
        </label>
        <label className="settings-checkbox">
          <input
            type="checkbox"
            checked={rememberToken}
            onChange={e => setRememberToken(e.target.checked)}
          />
          Remember token on this device
        </label>
        <p className="status">Remembered tokens are stored in this browser.</p>
        <button className="retry-button" type="button" onClick={clearToken}>
          Clear token
        </button>
      </section>

      <section className="settings-section">
        <h3>API Cache</h3>
        <button className="retry-button" type="button" onClick={handleClearCache}>
          Clear API cache
        </button>
      </section>

      <section className="settings-section">
        <h3>Favorites Data</h3>
        <label className="settings-field">
          <span>Favorites JSON</span>
          <textarea
            aria-label="Favorites JSON"
            value={favoritesJson}
            onChange={e => setFavoritesJson(e.target.value)}
            rows={8}
          />
        </label>
        <div className="settings-actions">
          <button className="retry-button" type="button" onClick={handleExportFavorites}>
            Export favorites
          </button>
          <button className="retry-button" type="button" onClick={handleImportFavorites}>
            Import favorites
          </button>
          <button className="retry-button" type="button" onClick={handleClearFavorites}>
            Clear favorites
          </button>
        </div>
      </section>

      {error && <p className="status error" role="alert">{error}</p>}
      {message && <p className="status">{message}</p>}
    </div>
  )
}

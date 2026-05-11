import { useState } from 'react'
import { useFavoriteNotesStore } from '@/store/favoriteNotesStore'

interface FavoriteNoteEditorProps {
  userId: number
  login: string
}

function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

export default function FavoriteNoteEditor({ userId, login }: FavoriteNoteEditorProps) {
  const note = useFavoriteNotesStore(s => s.notesByUserId[userId])
  const setNote = useFavoriteNotesStore(s => s.setNote)
  const [draft, setDraft] = useState(note?.body ?? '')
  const [isEditing, setIsEditing] = useState(false)

  function handleOpenEditor() {
    setDraft(note?.body ?? '')
    setIsEditing(true)
  }

  function handleSave() {
    setNote(userId, draft)
    setIsEditing(false)
  }

  function handleCancel() {
    setDraft(note?.body ?? '')
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="favorite-note-editor">
        {note
          ? <p className="favorite-note-summary">{note.body}</p>
          : <p className="favorite-note-empty">No note</p>}
        <button
          type="button"
          className="favorite-note-toggle"
          aria-label={note ? `Edit note for ${login}` : `Add note for ${login}`}
          onClick={handleOpenEditor}
        >
          {note ? 'Edit' : 'Add note'}
        </button>
      </div>
    )
  }

  return (
    <div className="favorite-note-editor">
      <label>
        <span>Note</span>
        <textarea
          aria-label={`Note for ${login}`}
          value={draft}
          onChange={event => setDraft(event.target.value)}
          rows={3}
        />
      </label>

      <div className="favorite-note-actions">
        <button
          type="button"
          className="retry-button"
          aria-label={`Save note for ${login}`}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="retry-button"
          aria-label={`Cancel note edit for ${login}`}
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>

      {note?.updatedAt && (
        <p className="status">
          Updated
          {' '}
          <time dateTime={note.updatedAt}>{formatUpdatedAt(note.updatedAt)}</time>
        </p>
      )}
    </div>
  )
}

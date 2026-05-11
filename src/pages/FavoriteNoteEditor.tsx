import { useState } from 'react'
import { useFavoriteNotesStore } from '@/store/favoriteNotesStore'

interface FavoriteNoteEditorProps {
  userId: number
  login: string
}

export default function FavoriteNoteEditor({ userId, login }: FavoriteNoteEditorProps) {
  const note = useFavoriteNotesStore(s => s.notesByUserId[userId])
  const setNote = useFavoriteNotesStore(s => s.setNote)
  const [draft, setDraft] = useState(note?.body ?? '')
  const [savedMessage, setSavedMessage] = useState('')

  function handleSave() {
    setNote(userId, draft)
    setSavedMessage(draft.trim() ? 'Saved note' : 'No saved note')
  }

  function handleCancel() {
    setDraft(note?.body ?? '')
    setSavedMessage('')
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
          <time dateTime={note.updatedAt}>{note.updatedAt}</time>
        </p>
      )}
      {savedMessage && <p className="status">{savedMessage}</p>}
    </div>
  )
}

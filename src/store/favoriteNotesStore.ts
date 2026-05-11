import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FavoriteNote {
  userId: number
  body: string
  updatedAt: string
}

interface FavoriteNotesStore {
  notesByUserId: Record<number, FavoriteNote>
  setNote: (userId: number, body: string) => void
  removeNote: (userId: number) => void
  clearNotes: () => void
}

export const useFavoriteNotesStore = create<FavoriteNotesStore>()(
  persist(
    set => ({
      notesByUserId: {},
      setNote: (userId, body) => set((state) => {
        const nextBody = body.trim()

        if (!nextBody) {
          const { [userId]: _removed, ...nextNotes } = state.notesByUserId
          return { notesByUserId: nextNotes }
        }

        return {
          notesByUserId: {
            ...state.notesByUserId,
            [userId]: {
              userId,
              body: nextBody,
              updatedAt: new Date().toISOString(),
            },
          },
        }
      }),
      removeNote: userId => set((state) => {
        const { [userId]: _removed, ...nextNotes } = state.notesByUserId
        return { notesByUserId: nextNotes }
      }),
      clearNotes: () => set({ notesByUserId: {} }),
    }),
    {
      name: 'github-user-search:favorite-notes',
      partialize: state => ({ notesByUserId: state.notesByUserId }),
    },
  ),
)

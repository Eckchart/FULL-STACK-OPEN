import { create } from 'zustand'

const useNoteStore = create((set) => ({
  notes: [],
  actions: {
    add: (note) => set(
      // can also do
      // state => ({ notes: [...state.notes, note] })
      state => ({ notes: state.notes.concat(note) })
    ),

    toggleImportance: (id) => set(
      (state) => ({
        notes: state.notes.map(note =>
          note.id === id ? { ...note, important: !note.important } : note
        )
      })
    )
  }
}))

const useNotes = () => useNoteStore(state => state.notes)

const useNoteActions = () => useNoteStore(state => state.actions)

export { useNotes, useNoteActions }

import { create } from 'zustand'
import noteService from './services/notes'
import { devtools } from 'zustand/middleware'

// const logger = (config) => (set, get) => config(
//   (...args) => {
//     console.log('prev state', get())
//     set(...args)
//     console.log('next state', get())
//   },
//   get
// )

const initialNotes = [
  {
    id: 1,
    content: 'Zustand is less complex than Redux',
    important: true,
  },
  {
    id: 2,
    content: 'React app benefits from custom hooks',
    important: false,
  },
  {
    id: 3,
    content: 'Remember to sleep well',
    important: true,
  }
]

const useNoteStore = create(devtools((set, get) => ({
  notes: initialNotes,
  filter: 'all',
  actions: {
    add: async (content) => {
      const newNote = await noteService.createNew(content)
      // can also do
      //  state => ({ notes: [...state.notes, newNote] })
      set(state => ({ notes: state.notes.concat(newNote) }))
    },

    toggleImportance: async (id) => {
      const noteToUpdate = get().notes.find(n => n.id === id)
      const updatedNote = await noteService.update(
        id,
        { ...noteToUpdate, important: !noteToUpdate.important }
      )
      set((state) => ({
        notes: state.notes.map(note => note.id === id ? updatedNote : note)
      }))
    },

    setFilter: (value) => set(() => ({ filter: value })),

    initialize: async () => {
      const notes = await noteService.getAll()

      // SAME AS `set(() => ({ notes }))`
      set(() => ({ notes: notes }))
    }
  }
})))

const useNotes = () => {
  const notes = useNoteStore(state => state.notes)
  const filter = useNoteStore(state => state.filter)

  if (filter === 'important') {
    //  only important notes
    return notes.filter(note => note.important)
  }
  if (filter === 'unimportant') {
    //  only unimportant notes
    return notes.filter(note => !note.important)
  }
  return notes
}

const useFilter = () => useNoteStore(state => state.filter)

const useNoteActions = () => useNoteStore(state => state.actions)

export { useNotes, useFilter, useNoteActions }

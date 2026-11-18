import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from '../requests'

const useNotes = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes,
    refetchOnWindowFocus: false
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: (newNote) => {
      const notes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], notes.concat(newNote))
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: (updatedNote) => {
      const curNotes = queryClient.getQueryData(['notes'])
      queryClient.setQueryData(['notes'], curNotes.map(note =>
        note.id === updatedNote.id ? updatedNote : note
      ))
    }
  })

  return {
    notes: result.data,
    isPending: result.isPending,
    addNote: (content) => newNoteMutation.mutate({ content, important: true }),
    toggleImportance: (note) => updateNoteMutation.mutate({ 
      ...note, important: !note.important 
    })
  }
}

export { useNotes }

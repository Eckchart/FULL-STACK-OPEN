import { useEffect } from 'react'
import NoteForm from './components/NoteForm'
import NoteList from './components/NoteList'
import VisibilityFilter from './components/VisibilityFilter'
import { useNoteActions } from './store'

const App = () => {
  const { initialize } = useNoteActions()
  
  useEffect(() => {
    initialize()
  }, [initialize])
  
  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <NoteList />
    </div>
  )
}

export default App

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')
  const navigate = useNavigate()

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    navigate('/notes')
    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <label>
          content
          <input
            id='note-input'
            placeholder='write note content here'
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
        </label>

        <button type="submit">save</button>
      </form>
    </div>
  )
}


export default NoteForm

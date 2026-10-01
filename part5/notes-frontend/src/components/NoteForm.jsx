import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })
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

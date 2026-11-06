import { useState, useEffect } from 'react'
import noteService from './services/notes'
import Footer from './components/Footer'
import NoteForm from './components/NoteForm'
import Home from './components/Home'
import NoteList from './components/NoteList'
import {
  Routes, Route, Link, useMatch
} from 'react-router-dom'
import Note from './components/Note'

const App = () => {
  const [notes, setNotes] = useState([])
  const match = useMatch('/notes/:id')

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      // setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // do not render anything if 'notes' is still null
  if (!notes) {
    return null
  }

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const deleteNote = (id) => {
    noteService.remove(id).then(() => {
      setNotes(notes.filter(note => note.id !== id))
    })
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const updatedNote = { ...note, important: !note.important }

    noteService
      .update(id, updatedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      // .catch(() => {
      //   setErrorMessage(`Note '${note.content}' was already removed from the server`)
      //   setTimeout(() => {
      //     setErrorMessage(null)
      //   }, 5000)
      //   setNotes(notes.filter(n => n.id !== id))
      // })
  }

  const padding = {
    padding: 5
  }

  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/create">new note</Link>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/notes/:id" element={
          <Note
            note={note}
            toggleImportance={toggleImportanceOf}
            deleteNote={deleteNote}
          />
        } />

        <Route path="/notes" element={
          <NoteList notes={notes} />
        } />

        <Route path="/create" element={
          <NoteForm createNote={addNote} />
        } />
      </Routes>

      <Footer />
    </div>
  )
}

export default App

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
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import Notification from './components/Notification'

const App = () => {
  const [notes, setNotes] = useState([])
  const [notification, setNotification] = useState(null)
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
        // todo: fix this temp sol
        const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
        returnedNote.user = JSON.parse(loggedUserJSON)
        setNotes(notes.concat(returnedNote))

        setNotification({ text: `Note ${returnedNote.content} added!`, type: 'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
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
      .catch(() => {
        setNotes(notes.filter(n => n.id !== id))
        setNotification({
          text: `Note '${note.content}' was already removed from the server`,
          type: 'error'
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const note = match
    ? notes.find(note => note.id === match.params.id)
    : null
  const style = {
    '&:hover': {
      bgcolor: 'rgba(255, 255, 255, 0.3)'
    }
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/" sx={style}>home</Button>
          <Button color="inherit" component={Link} to="/notes" sx={style}>notes</Button>
          <Button color="inherit" component={Link} to="/create" sx={style}>new note</Button>
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

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
    </Container>
  )
}

export default App

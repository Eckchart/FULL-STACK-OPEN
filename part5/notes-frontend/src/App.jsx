import { useState, useEffect } from "react"
import Note from "./components/Note"
import noteService from './services/notes'
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import loginService from './services/login'
import LoginForm from "./components/LoginForm"
import NoteForm from "./components/NoteForm"

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // console.log('effect');
    noteService
      .getAll()
      .then(initialNotes => {
        // console.log('promise fulfilled');
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    console.log('entered second useEffect')
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // do not render anything if 'notes' is still null
  if (!notes) {
    return null
  }
  
  // console.log('render', notes.length, 'notes');

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1)
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  
  const handleNoteChange = (event) => {
    // console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(() => {
        setErrorMessage(`Note '${note.content}' was already removed from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('Wrong credentials!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    noteService.setToken(null)
    setUser(null)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && (
        <LoginForm
          username={username}
          password={password}
          onUsernameChange={({ target }) => setUsername(target.value)}
          onPasswordChange={({ target }) => setPassword(target.value)}
          onLoginSubmit={handleLogin}
        />
      )}

      {user && (
        <div>
          <p>{user.name} logged in</p>
          <NoteForm
            newNote={newNote}
            onNoteSubmit={addNote}
            onNoteChange={handleNoteChange}
          />
        </div>
      )}

      {user && <button onClick={handleLogout}>Log out</button>}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>

      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>

      <Footer />
    </div>
  )
}


export default App

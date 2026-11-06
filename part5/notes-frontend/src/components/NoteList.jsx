import { useState, useEffect } from 'react'
import noteService from '../services/notes'
import Notification from './Notification'
import loginService from '../services/login'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import { Link } from 'react-router-dom'

const NoteList = ({ notes }) => {
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')
  const [user, setUser] = useState(null)

  useEffect(() => {
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

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
    } catch {
      setErrorMessage('Wrong credentials!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    noteService.setToken(null)
    setUser(null)
  }

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm onLogin={handleLogin} />
    </Togglable>
  )

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}

      {user && (
        <div>
          <p>{user.name} logged in</p>
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
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>
              {note.content}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}


export default NoteList

import { useState, useEffect } from 'react'
import noteService from '../services/notes'
import Notification from './Notification'
import loginService from '../services/login'
import LoginForm from './LoginForm'
import Togglable from './Togglable'
import { Link } from 'react-router-dom'
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper
} from '@mui/material'

const NoteList = ({ notes }) => {
  const [showAll, setShowAll] = useState(true)
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
    } catch {/*
      setErrorMessage('Wrong credentials!')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    */ }
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>content</TableCell>
              <TableCell>user</TableCell>
              <TableCell>important</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {notesToShow.map(note =>
              <TableRow key={note.id}>
                <TableCell>
                  <Link to={`/notes/${note.id}`}>
                    {note.content}
                  </Link>
                </TableCell>

                {/* {console.log('note.user: ', note.user)} */}
                <TableCell>{note.user.name}</TableCell>
                <TableCell>{note.important ? 'yes' : 'no'}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <ul>
        {notesToShow.map(note =>
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>
              {note.content}
            </Link>
          </li>
        )}
      </ul> */}
    </div>
  )
}


export default NoteList

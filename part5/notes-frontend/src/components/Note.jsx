import { useParams, useNavigate } from 'react-router-dom'

const Note = ({ note, toggleImportance, deleteNote }) => {
  const id = useParams().id
  const navigate = useNavigate()
  // const note = notes.find(note => note.id === id)
  const label = note.important ? 'make not important' : 'make important'

  const handleDelete = () => {
    if (window.confirm(`Delete note ${note.content}`)) {
      deleteNote(id)
      navigate('/notes')
    }
  }

  if (!note) {
    return null
  }

  return (
    <li className="note">
      <span>Your awesome note: {note.content}</span>
      {' '}
      <button onClick={() => toggleImportance(id)}>{label}</button>
      <button onClick={handleDelete}>delete</button>
    </li>
  )
}

export default Note

const baseUrl = 'http://localhost:3002/notes'

const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }
 
  const response = await fetch(baseUrl, options)
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  return await response.json()
}

const updateNote = async (updatedNote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  }

  const response = await fetch(`${baseUrl}/${updatedNote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}

export { getNotes, createNote, updateNote }

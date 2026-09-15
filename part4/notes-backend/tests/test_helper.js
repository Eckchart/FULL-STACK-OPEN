const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
    user: null
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
    user: null
  }
]

const initialUsers = [
  {
    username: 'username1',
    name: 'My name1',
    password: 'Pa$$word1',
    notes: []
  },
  {
    username: 'username2',
    name: 'My name2',
    password: 'Pa$$word2',
    notes: []
  },
]

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = {
  initialNotes, initialUsers, nonExistingId, notesInDb, usersInDb
}

const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/note')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Note.deleteMany({})
    await User.deleteMany({})
    for (const user of helper.initialUsers) {
      // need to make a POST request for every user in
      // order to have a password hash for every user
      await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }

    const users = await User.find({})
    // version 0 (INCORRECT):
    // helper.initialNotes.forEach(async (note) => {
    //   let noteObject = new Note(note)
    //   await noteObject.save()
    // })

    // version 1 (INCORRECT if the operations in the `promiseArray`
    // need to happen in a particular order)
    // const noteObjects = helper.initialNotes
    //   .map(note => new Note(note))
    // const promiseArray = noteObjects.map(note => note.save())
    // await Promise.all(promiseArray)

    // version 2 (IDK)
    // await Note.insertMany(helper.initialNotes)

    // version 3
    for (const note of helper.initialNotes) {
      const noteObject = new Note(note)
      const curUser = users[Math.floor(Math.random() * users.length)]

      noteObject['user'] = curUser.id
      await noteObject.save()

      curUser.notes = curUser.notes.concat(noteObject._id)
      await curUser.save()
    }
  })


  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    assert.strictEqual(response.body.length, helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(e => e.content)
    assert(contents.includes('HTML is easy'))
  })

  describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToView = notesAtStart[0]
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      // When we do `response.json(note)` in the GET '/api/notes/:id'
      // route, Express serializes note.user into a String, whereas
      // in the `helper.notesInDb()` function, even if we return
      // `notes.map(note => note.toJSON())`, that does NOT transform
      // the `user` field of notes into a String - it remains an ObjectId.
      // It's something like the difference between `JSON.stringify()` (which
      // is what `response.json(note)` does) and `note.toJSON()` (which is
      // what `helper.notesInDb()` does).
      const normalizedNote = { ...noteToView, user: noteToView.user.toString() }
      assert.deepStrictEqual(resultNote.body, normalizedNote)
    })

    test('fails with status code 404 if note does not exist', async () => {
      const validNonExistingId = await helper.nonExistingId()
      await api
        .get(`/api/notes/${validNonExistingId}`)
        .expect(404)
    })

    test('fails with status code 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api.get(`/api/notes/${invalidId}`).expect(400)
    })
  })

  describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
      // log the user in, first
      const loggedInUser = await User.findOne({ username: helper.initialUsers[0].username })
      const loginResponse = await api
        .post('/api/login')
        .send({ username: loggedInUser.username, password: helper.initialUsers[0].password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
        userId: loggedInUser.id
      }
      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(r => r.content)
      assert(contents.includes('async/await simplifies making async calls'))
    })

    test('fails with status code 400 if data is invalid', async () => {
      const loggedInUser = await User.findOne({ username: helper.initialUsers[0].username })
      const loginResponse = await api
        .post('/api/login')
        .send({ username: loggedInUser.username, password: helper.initialUsers[0].password })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const newNote = {
        important: true
      }
      await api
        .post('/api/notes')
        .set('Authorization', `Bearer ${loginResponse.body.token}`)
        .send(newNote)
        .expect(400)

      const notesAtEnd = await helper.notesInDb()
      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length)
    })
  })

  describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]
      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)
      const notesAtEnd = await helper.notesInDb()

      const idsAtEnd = notesAtEnd.map(note => note.id)
      assert(!idsAtEnd.includes(noteToDelete.id))

      assert.strictEqual(notesAtEnd.length, helper.initialNotes.length - 1)
    })
  })
})


after(async () => {
  // the connection is made in the app.js file!
  await mongoose.connection.close()
})

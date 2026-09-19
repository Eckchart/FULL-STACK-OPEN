const { describe, test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  
  // add one user
  const userObj = helper.initialUsers[0]
  const passwordHash = await bcrypt.hash(userObj['password'], 10)
  const userToSave = new User({
    username: userObj['username'],
    name: userObj['name'],
    passwordHash
  })
  await userToSave.save()
})


describe('invalid users are not created', () => {
  test('when username is missing', async () => {
    const userToAdd = {
      name: helper.initialUsers[0].name,
      password: helper.initialUsers[0].password
    }
    await api
      .post('/api/users')
      .send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('when username is NOT unique', async () => {
     const userToAdd = {
      username: helper.initialUsers[0].username,
      name: helper.initialUsers[0].name,
      password: helper.initialUsers[0].password
    }
    await api
      .post('/api/users')
      .send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('when username is present and unique, but does NOT respect other validations', async () => {
    const userToAdd = {
      username: 'UN',
      name: helper.initialUsers[0].name,
      password: helper.initialUsers[0].password
    }
    await api
      .post('/api/users')
      .send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('when password is missing', async () => {
    // make sure `helper.initialUsers[1]` isn't already in the DB here!!
    const userObjNotInDb = helper.initialUsers[1]
    const userToAdd = {
      username: userObjNotInDb.username,
      name: userObjNotInDb.name,
    }
    await api
      .post('/api/users')
      .send(userToAdd)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})


after(async () => {
  mongoose.connection.close()
})

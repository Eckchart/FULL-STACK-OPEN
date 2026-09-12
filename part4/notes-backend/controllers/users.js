const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  // Validate password
  if (password.length < 6 || !(/[a-z]/.test(password))
      || !(/[A-Z]/.test(password)) || !(/[0-9]/.test(password))
      || !(/[_!@#$%^&*()+]/.test(password))) {
    return response.status(400).json({
      error: 'Password must be at least 6 characters long and include at least '
        + 'one lowercase character, one uppercase character, one number, and one special character'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


module.exports = usersRouter

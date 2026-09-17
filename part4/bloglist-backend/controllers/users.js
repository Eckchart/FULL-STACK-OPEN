const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({})
    .select({ passwordHash: 0 })
    .populate('blogs', { user: 0 })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body
  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const userToSave = new User({
    name,
    username,
    passwordHash
  })
  const savedUser = await userToSave.save()
  res.status(201).json(savedUser)
})


module.exports = usersRouter

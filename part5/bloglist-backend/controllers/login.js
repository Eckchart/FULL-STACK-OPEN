const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })
  const isPasswordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Incorrect username or password" })
  }

  const userData = {
    username,
    id: user._id
  }
  const token = jwt.sign(
    userData,
    process.env.SECRET,
    { expiresIn: 60 * 60 }
  )
  res.status(200).json({ token, username, name: user.name })
})


module.exports = loginRouter

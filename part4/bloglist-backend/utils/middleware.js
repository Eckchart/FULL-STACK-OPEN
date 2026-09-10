const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "Unknown endpoint" })
}


module.exports = { errorHandler, unknownEndpoint }

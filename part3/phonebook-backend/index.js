require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()

// The json-parser takes the JSON data of a request, transforms it
// into a JavaScript object and then attaches it to the body property
// of the request object before the route handler is called.
app.use(express.json())
app.use(express.static('dist'))


// MIDDLEWARE CONFIG //

const errorHandler = (error, req, res, next) => {
  console.log('AN ERROR HAS OCCURRED:', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }
  next(error)
}

///////////////////////

// morgan configuration //

morgan.token('post_data', (req) => JSON.stringify(req.body))
app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_data', {
  skip: (req) => req.method !== 'POST'
}))

//////////////////////////

app.get('/', (_, res) => {
  res.send('<h1>PHONEBOOK BACKEND</h1>')
})
app.get('/api/persons', (_, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})
app.get('/info', (_, res, next) => {
  Person
    .countDocuments()
    .then(nrDocuments => {
      const htmlAns =
        `
          <p>Phonebook has info for ${nrDocuments} people</p>
          <p>${new Date()}</p>
        `
        res.send(htmlAns)
    })
    .catch(error => next(error))
})
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person
    .findById(id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }
      return res.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person
    .findByIdAndDelete(id)
    .then(deletedPerson => {
      console.log('deleted result:', deletedPerson)
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  let errors = []
  if (!body.name) {
    errors.push('name missing')
  }
  if (!body.number) {
    errors.push('number missing')
  }
  // if (body.name && persons.find(p => p.name === body.name)) {
  //   errors.push('name must be unique')
  // }
  if (errors.length > 0) {
    return res.status(400).send({ errors })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })
  newPerson.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const { name, number } = req.body

  Person
    .findById(id)
    .then(person => {
      if (!person) {
        return res.status(404).end()
      }
      person.name = name
      person.number = number
      return person.save().then(updatedPerson => {
        res.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

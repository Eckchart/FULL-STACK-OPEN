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

// morgan configuration //

morgan.token('post_data', (req) => JSON.stringify(req.body))
app.use(morgan('tiny', {
  skip: (req) => req.method === 'POST'
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post_data', {
  skip: (req) => req.method !== 'POST'
}))

//////////////////////////


let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => Math.floor(Math.random() * 1e5).toString()

app.get('/', (_, res) => {
  res.send('<h1>PHONEBOOK BACKEND</h1>')
})
app.get('/api/persons', (_, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})
app.get('/info', (_, res) => {
  const htmlAns =
  `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `
  res.send(htmlAns)
})
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = persons.find(p => p.id === id)
  if (!person) {
    res.status(404).end()
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person
    .findByIdAndDelete(id)
    .then(deletedPerson => {
      console.log('deleted result:', deletedPerson)
      res.status(204).end()
    })
    .catch(error => {
      console.log('error', error)
    })
})

app.post('/api/persons', (req, res) => {
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
  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  })
})


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

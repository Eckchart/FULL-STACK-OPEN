const express = require('express')
const morgan = require('morgan')
const app = express()

// The json-parser takes the JSON data of a request, transforms it
// into a JavaScript object and then attaches it to the body property
// of the request object before the route handler is called.
app.use(express.json())

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
  res.json(persons)
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
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
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
  if (body.name && persons.find(p => p.name === body.name)) {
    errors.push('name must be unique')
  }
  if (errors.length) {
    return res.status(400).json({
      'errors': errors
    })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson)
  res.json(newPerson)
})


const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

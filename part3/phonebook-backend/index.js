const express = require('express')
const app = express()

// The json-parser takes the JSON data of a request, transforms it
// into a JavaScript object and then attaches it to the body property
// of the request object before the route handler is called.
app.use(express.json())

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

app.get('/', (req, res) => {
  res.send('<h1>PHONEBOOK BACKEND</h1>')
})
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

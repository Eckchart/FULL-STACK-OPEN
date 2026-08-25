import { useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '0234567891' },
    { name: 'Ada Lovelace', number: '39-44-5323523'},
    { name: 'Dan Abramov', number: '12-43-234345'},
    { name: 'Mary Poppendieck', number: '39-23-6423122'} 
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName))
    {
      alert(`${newName} is already added to phonebook`)
      return
    }
    
    const newPersonObject = {
      name: newName,
      number: newNumber
    }

    setPersons(persons.concat(newPersonObject))
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterTextChange = (event) => {
    setFilterText(event.target.value)
  }

  const personsToShow = filterText == ''
    ? persons
    : persons.filter(person => (
        person.name.toLowerCase().includes(filterText.toLowerCase())
      ))
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterText={filterText} onChange={handleFilterTextChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson} newName={newName} newNumber={newNumber}
        onNameChange={handleNameChange} onNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App

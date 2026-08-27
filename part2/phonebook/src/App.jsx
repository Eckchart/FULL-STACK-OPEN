import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [successfulMessage, setSuccessfulMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    let person
    if ((person = persons.find(person => person.name === newName))) {
      if (window.confirm(`${person.name} is already added to the phonebook, ` +
        'replace the old number with a new one?')) {
        updatePerson(person.id)
      }
      return
    }
    
    const newPersonObject = {
      name: newName,
      number: newNumber
    }
    personService
      .create(newPersonObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setSuccessfulMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setSuccessfulMessage(null)
        }, 5000)
      })
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    if (!personToDelete) {
      alert("That person doesn't exist.")
      return
    }
    if (!window.confirm(`Delete ${personToDelete.name}?`)) {
      return
    }

    personService
      .destroy(id)
      .then(deletedPerson => {
        setPersons(persons.filter(p => p.id !== deletedPerson.id))
      });
  }

  const updatePerson = (id) => {
    const changedPerson = {
      name: newName,
      number: newNumber,
    }
    personService
      .update(id, changedPerson)
      .then(updatedPerson => {
        setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p))
        setNewName('')
        setNewNumber('')
        setSuccessfulMessage(`Updated ${updatedPerson.name}'s number to ${updatedPerson.number}`)
        setTimeout(() => {
          setSuccessfulMessage(null)
        }, 5000)
      })
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

  const personsToShow = filterText === ''
    ? persons
    : persons.filter(person => (
        person.name.toLowerCase().includes(filterText.toLowerCase())
      ))
  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successfulMessage} />
      <Filter filterText={filterText} onChange={handleFilterTextChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson} newName={newName} newNumber={newNumber}
        onNameChange={handleNameChange} onNumberChange={handleNumberChange}
      />
      
      <h3>Numbers</h3>
      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App

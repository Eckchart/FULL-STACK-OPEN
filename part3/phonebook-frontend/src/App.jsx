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
  const [notifMessage, setNotifMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

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
        setNotifMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000)
        setMessageType('success')
      })
  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    if (!window.confirm(`Delete ${personToDelete.name}?`)) {
      return
    }

    personService
      .destroy(id)
      .then(deletedPerson => {
        setPersons(persons.filter(p => p.id !== deletedPerson.id))
      })
      .catch(error => {
        setPersons(persons.filter(p => p.id !== id))
        setNotifMessage(`Information of ${personToDelete.name} has ` +
          `already been removed from the server`)
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000)
        setMessageType('error')
      })
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
        setNotifMessage(`Updated ${updatedPerson.name}'s number to ${updatedPerson.number}`)
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000)
        setMessageType('success')
      })
      .catch(error => {
        setPersons(persons.filter(p => p.id !== id))
        setNotifMessage(`Information of ${changedPerson.name} has ` +
          `already been removed from the server`)
        setTimeout(() => {
          setNotifMessage(null)
        }, 5000)
        setMessageType('error')
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
      <Notification message={notifMessage} messageType={messageType} />
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

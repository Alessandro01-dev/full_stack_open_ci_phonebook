import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error during fetching data:', error)
        setMessage({ text: 'Could not fetch data from server', type: 'error' })
        setTimeout(() => setMessage(null), 5000)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = filter === ''
    ? persons
    : persons.filter(person =>
      person.name.toLowerCase().includes(filter.toLowerCase()))

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }

    const nameExists = persons.find(person =>
      person.name.toLowerCase().trim() === newName.toLowerCase().trim()
    )

    if (nameExists) {
      const hasConfirmed = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (hasConfirmed) {
        const changedPerson = { ...nameExists, number: newNumber }

        personService
          .update(nameExists.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== nameExists.id ? person : returnedPerson))
            setNewName('')
            setNewNumber('')
            setMessage({ text: `Updated ${returnedPerson.name}'s number`, type: 'success' })
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            if (error.response && error.response.data.error) {
              setMessage({ text: error.response.data.error, type: 'error' })
            } else {
              setMessage({ text: `Information of ${nameExists.name} has already been removed`, type: 'error' })
              setPersons(persons.filter(p => p.id !== nameExists.id))
            }
            setTimeout(() => setMessage(null), 5000)
          })

      }
    } else {
      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage({ text: `Added ${returnedPerson.name}`, type: 'success' })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
        .catch(error => {
          setMessage({ text: error.response.data.error, type: 'error' })
          setTimeout(() => setMessage(null), 5000)
        })
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          setMessage({ text: `Deleted ${name}`, type: 'success' })
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
    </div>
  )
}

export default App
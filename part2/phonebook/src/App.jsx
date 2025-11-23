import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    personServices
      .getAllPersons()
      .then(initialPersons => {
        console.log('promise fulfilled with phonebook data fetched from server:', initialPersons)
        setPersons(initialPersons)
      })
  }, [])

  const filteredPersons = filterName === ''
    ? persons
    : persons.filter(person => 
      person.name.toLowerCase().includes(filterName.toLowerCase())
    )

  const handleFilter = (event) => {
    setFilterName(event.target.value)
  }
  
  const handleNewPerson = (event) => {
    const { name, value } = event.target;
    setNewPerson({ ...newPerson, [name]: value });
  }

  const addPerson = (event) => {
    event.preventDefault()
    const nameFound = persons.some(person => person.name.toLowerCase() === newPerson.name.toLowerCase())
    if (nameFound) {
      if (window.confirm(`${newPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate  = persons.find(
          p => p.name.toLowerCase() === newPerson.name.toLowerCase()
        )
        const updatedPerson = { ...personToUpdate, number: newPerson.number }
        personServices
          .updatePerson(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
            console.log('all persons on the phonebook with updated person:', returnedPerson)
            setNewPerson({ name: '', number: '' })
          })
      } else {
          return
      }
    } else {
      const newPersonObject = {
        name: newPerson.name,
        number: newPerson.number,
      }
      console.log('newly added person details with id:', newPersonObject)
      personServices
        .addPerson(newPersonObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          console.log('all persons on the phonebook with newly added person:', returnedPerson)
          setNewPerson({ name: '', number: '' })
        })
    }
  }

  const handleDeleteOf = id => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name} ?`)) {
      personServices
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilter={handleFilter} />
      <h3>Add a new</h3>      
      <PersonForm addPerson={addPerson} newPerson={newPerson} handleNewPerson={handleNewPerson} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDeleteOf={handleDeleteOf} />
    </div>
  )

}

export default App

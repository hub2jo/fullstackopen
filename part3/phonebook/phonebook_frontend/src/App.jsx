import { useState, useEffect } from 'react'
import personServices from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filterName, setFilterName] = useState('')
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [error, setError] = useState(false)

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
      if (window.confirm(`${newPerson.name} is already in phonebook, replace the old number with a new one?`)) {
        const personToUpdate  = persons.find(
          p => p.name.toLowerCase() === newPerson.name.toLowerCase()
        )
        const updatedPerson = { ...personToUpdate, number: newPerson.number }
        personServices
          .updatePerson(personToUpdate.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== personToUpdate.id ? p : returnedPerson))
            console.log('updated person:', returnedPerson)
            setNewPerson({ name: '', number: '' })          
            setNoticeMessage(
              `Person ${returnedPerson.name}'s number has been updated!`
            )
            setTimeout(() => {
              setNoticeMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.log('error updating person:', error.response.data.error)
            setError(true)
            setNoticeMessage(
              `Information about ${personToUpdate.name} was already removed from server`
            )
            setTimeout(() => {
              setNoticeMessage(null)
              setError(false)
            }, 5000)
            return
          })
      } else {
          return
      }
    } else {
      const newPersonObject = {
        name: newPerson.name,
        number: newPerson.number,
      }
      console.log('new-to-add person details:', newPersonObject)
      personServices
        .createPerson(newPersonObject)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          console.log('new person added:', createdPerson)
          setNewPerson({ name: '', number: '' })
          setNoticeMessage(
            `Person ${createdPerson.name} has been added!`
          )
          setTimeout(() => {
            setNoticeMessage(null)
          }, 5000)
        })
        .catch(error => {   
          // validation by Mongoose schema on the backend
          // access the error response message sent by the server
          console.log(error.response.data.error)  
          
          setError(true)
          setNoticeMessage(error.response.data.error)
          setTimeout(() => {
            setNoticeMessage(null)
          }, 5000)

        })
    }
  }

  const handleDeleteOf = id => {
    const person = persons.find(p => p.id === id)
    const personName = person.name // Store name before async operations
    
    if (window.confirm(`Delete ${person.name} ?`)) {
      personServices
        .deletePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          console.log('deleted person:', personName)
          setNoticeMessage(
            `Person ${personName} has been deleted!`
          )
          setTimeout(() => {
            setNoticeMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification error={error} message={noticeMessage} />
      <Filter filterName={filterName} handleFilter={handleFilter} />
      <h3>Add a new</h3>      
      <PersonForm addPerson={addPerson} newPerson={newPerson} handleNewPerson={handleNewPerson} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDeleteOf={handleDeleteOf} />
    </div>
  )

}


export default App

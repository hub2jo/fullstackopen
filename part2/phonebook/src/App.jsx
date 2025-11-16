import { useState, useEffect } from 'react'
import axios from 'axios'

const Person = ({ person }) => (<span>{person.name}: {person.number}<br></br></span>)
const Persons = ({ filteredPersons }) => (
  <div>
    {filteredPersons.map(person => 
      <Person key={person.id} person={person} />
    )}
  </div>
)
const Filter = ({ filterName, handleFilter}) => (
  <div>
    filter shown with: <input value={filterName} onChange={handleFilter} />
  </div>
)
const PersonForm = ({ addPerson, newPerson, handleNewPerson }) => (
  <form onSubmit={addPerson}>
    <div>name: <input name="name" value={newPerson.name} onChange={handleNewPerson} /></div>
    <div>number: <input name="number" value={newPerson.number} onChange={handleNewPerson} /></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled with phonebook data fetched from server:', response.data)
        setPersons(response.data)
      })
  }, [])

  const filteredPersons = filterName === ''
    ? persons
    : persons.filter(person => 
      person.name.toLowerCase().includes(filterName.toLowerCase())
    )

  console.log('render from the front-end (unfiltered)', persons.length, 'persons')
  console.log('render from the front-end (filtered)', filteredPersons.length, 'persons')

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
      alert(`${newPerson.name} is already added to phonebook`)
    } else {
      const newPersonObject = {
        name: newPerson.name,
        number: newPerson.number,
        id: String(persons.length + 1),
    }
      console.log('newly added person details with id:', newPersonObject)
      setPersons(persons.concat(newPersonObject))
      console.log('all persons on the phonebook with newly added person:', persons)
      setNewPerson({ name: '', number: '' })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} handleFilter={handleFilter} />
      <h3>Add a new</h3>      
      <PersonForm addPerson={addPerson} newPerson={newPerson} handleNewPerson={handleNewPerson} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App

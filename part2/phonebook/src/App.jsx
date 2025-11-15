import { useState } from 'react'

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
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newPerson, setNewPerson] = useState({ name: '', number: '' })
  const [filterName, setFilterName] = useState('')

  const handleFilter = (event) => {
    setFilterName(event.target.value)
  }

  const filteredPersons = filterName === ''
    ? persons
    : persons.filter(person => 
      person.name.toLowerCase().includes(filterName.toLowerCase())
    )

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

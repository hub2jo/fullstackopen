  const Person = ({ person, handleDelete }) => {
    return (
      <div>
        <span>{person.name}: {person.number} </span>
        <button onClick={handleDelete}>delete</button>
      </div>
    )
  }

  const Persons = ({ filteredPersons, handleDeleteOf}) => (
    <div>
      {filteredPersons.map(person => 
        <Person 
          key={person.id} 
          person={person} 
          handleDelete={() => handleDeleteOf(person.id)} />
      )}
    </div>
  )

  export default Persons;
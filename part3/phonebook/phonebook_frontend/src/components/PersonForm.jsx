  const PersonForm = ({ addPerson, newPerson, handleNewPerson }) => (
    <form onSubmit={addPerson}>
      <div>name: <input name="name" value={newPerson.name} onChange={handleNewPerson} /></div>
      <div>number: <input name="number" value={newPerson.number} onChange={handleNewPerson} /></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )

export default PersonForm
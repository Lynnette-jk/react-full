import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-1234567' },
    { name: 'Ada Lovelace', phone: '39-44-5323523' },
    { name: 'Dan Abramov', phone: '12-43-234345' },
    { name: 'Mary Poppendieck', phone: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    if (existingPerson) {
      alert(`${newName} is already added to the phonebook!`)
    } else {
      const newPerson = { name: newName, phone: newPhone }
      setPersons(persons.concat(newPerson))
      setNewName('')
      setNewPhone('')
    }
  }

  const filteredPersons = searchQuery
    ? persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with: <input value={searchQuery} onChange={handleSearchQueryChange} />
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          phone: <input value={newPhone} onChange={handlePhoneChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person, i) => <li key={i}>{person.name} {person.phone}</li>)}
      </ul>
    </div>
  )
}

export default App





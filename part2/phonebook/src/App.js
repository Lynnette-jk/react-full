import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons';


const Filter = ({ searchQuery, handleSearchQueryChange }) => {
  return (
    <div>
      filter shown with: <input value={searchQuery} onChange={handleSearchQueryChange} />
    </div>
  )
}

const PersonForm = ({ newName, newPhone, handleNameChange, handlePhoneChange, addPerson }) => {
  return (
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
  )
}

const Persons = ({ persons }) => {
  return (
    <ul>
      {persons.map((person, i) => <li key={i}>{person.name} {person.phone}</li>)}
    </ul>
  )
}

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

  useEffect(() => {
    personsService.getAll().then(initialPersons => {
      setPersons(initialPersons);
    });
  }, []);

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
  
    const newPerson = {
      name: newName,
      phone: newPhone,
      important: Math.random() > 0.5,
    }
  
    personsService.create(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson));
      setNewName('');
      setNewPhone('');
    });
  }
  

  const filteredPersons = searchQuery
    ? persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} handleSearchQueryChange={handleSearchQueryChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newPhone={newPhone} handleNameChange={handleNameChange} handlePhoneChange={handlePhoneChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} />
    </div>
  )
}

export default App






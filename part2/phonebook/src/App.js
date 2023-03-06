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



const Persons = ({ persons, deletePerson}) => {
  return (
    <ul>
      {persons.map((person, i) => 
      <li key={i}>{person.name} {person.phone}
      <button onClick={() => deletePerson(person.id, person.name)}>delete</button>
      </li>)}
    </ul>
  )
}
const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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
  
    const existingPerson = persons.find((person) => person.name === newName)

  if (existingPerson) {
    const confirmed = window.confirm(
      `${existingPerson.name} is already in the phonebook. Replace the old number with a new one?`
    )
    if (confirmed) {
      const updatedPerson = { ...existingPerson, phone: newPhone }
      personsService
        .update(existingPerson.id, updatedPerson)
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : response
            )
          )
          setNewName('')
          setNewPhone('')
          setSuccessMessage(`Updated ${updatedPerson.name}'s phone number`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(`Information of ${existingPerson.name} has already been removed from server`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
    return
  }

    const newPerson = {
      name: newName,
      phone: newPhone,
      important: Math.random() > 0.5,
    }
    personsService.create(newPerson)
    .then(response => {
      setPersons(persons.concat(response))
      setNewName('')
      setNewPhone('')
      setSuccessMessage(`Added ${response.name} to phonebook`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    })
    .catch(error => {
      setErrorMessage('Failed to add person')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
  }

  const removePerson = id => {
    axios
      .delete(`http://localhost:3001/persons/${id}`)
      .then(response => {
        console.log("Person deleted from server!");
      })
      .catch(error => {
        console.log("Error deleting person from server:", error);
      });
  };
  
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      removePerson(id);
      setPersons(persons.filter(person => person.id !== id));
          setSuccessMessage(`${name} deleted from phonebook`);
          setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);
        
      }
    };
  
  

  const filteredPersons = searchQuery
    ? persons.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : persons

  return (
    <div>
      {successMessage && <div className="success">{successMessage}</div>}
      {errorMessage && <div className="error">{errorMessage}</div>}
      <h2>Phonebook</h2>
      <Filter searchQuery={searchQuery} handleSearchQueryChange={handleSearchQueryChange} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newPhone={newPhone} handleNameChange={handleNameChange} handlePhoneChange={handlePhoneChange} addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
      <Notification message={errorMessage} />
    </div>
  )
}

export default App






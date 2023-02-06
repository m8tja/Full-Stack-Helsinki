import { useState, useEffect } from "react";
import personService from "./services/persons"

const Filter = ({filter, setFilter}) => {

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>filter shown with <input value={filter} onChange={handleFilterChange}/></div>
  )
}

const PersonForm = ({persons, setPersons}) => {

  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  let exists = false
  let replace = false

  const addPerson = (event) => {

    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
    }
    
    persons.forEach(person => {
      if(person.name === personObject.name) {
        exists = true
        return
      }
    })

    exists ? 
    (replace = window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) : 
    personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
      })

    if(replace) {

      const oldPerson = persons.find(p => p.name === personObject.name)

      personService
        .update(oldPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
        })
        .catch(error => {
          alert(`the person ${oldPerson.name} was already deleted from the server`)
          setPersons(persons.filter(p => p.id !== oldPerson.id))
        })
    }

    setNewName("")
    setNewNumber("")
    exists = false
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newName} onChange={handleNameChange}/></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({persons, setPersons, filter}) => {

  const deletePerson = (id) => {
    
    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }

  return (
    <ul>
      {persons.map(person => {
        if(person.name.toLowerCase().includes(filter))
          return <li key={person.id}>{person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button></li>
        return null
      })}
    </ul>
  )
}

const App = () => {

  /*
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  */
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const [filter, setFilter] = useState("")

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons}/>
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filter={filter} />
    </div>
  )
}

export default App;

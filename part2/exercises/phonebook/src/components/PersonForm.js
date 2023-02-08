import {useState} from "react";
import personService from "../services/persons"

const PersonForm = ({persons, setPersons, setErrorMessage, setErrorType}) => {

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
        setErrorMessage(
          `Added ${returnedPerson.name}`
        )
        setErrorType("green")
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })

    if(replace) {

      const oldPerson = persons.find(p => p.name === personObject.name)

      personService
        .update(oldPerson.id, personObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== oldPerson.id ? person : returnedPerson))
          setErrorMessage(
            `${returnedPerson.name}'s number changed to ${returnedPerson.number}`
          )
          setErrorType("green")
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        .catch(error => {
          setPersons(persons.filter(p => p.id !== oldPerson.id))
          setErrorMessage(
            `Information of ${oldPerson.name} has already been removed from the server`
          )
          setErrorType("red")
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
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

export default PersonForm
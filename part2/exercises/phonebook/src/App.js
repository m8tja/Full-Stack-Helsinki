import { useState, useEffect } from "react";
import personService from "./services/persons"
import Notification from "./components/Notification";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {

  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState("")
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState("")

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} errorType={errorType}/>
      <Filter filter={filter} setFilter={setFilter}/>
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} setErrorMessage={setErrorMessage} setErrorType={setErrorType}/>
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} filter={filter} />
    </div>
  )
}

export default App;

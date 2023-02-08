import personService from "../services/persons"

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

export default Persons
import {useEffect, useState} from "react"
import countryService from "./services/countries"

const Filter = ({filter, setFilter}) => {

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <div>find countries <input value={filter} onChange={handleFilterChange}/></div>
  )
}

const Country = ({countries, filteredCountries, setFilteredCountries, filter}) => {

  useEffect(() => {
    setFilteredCountries(countries.filter(c => c.name.common.toLowerCase().includes(filter)))
  }, [filter])

  return (
    <div>
      {filteredCountries.length > 10 ?
      <p>Too many matches, specify another filter</p>:
      filteredCountries.length === 1 ?
      <CountryDetails country={filteredCountries[0]}/>:
      <ul>
        {filteredCountries.map((country, i) => {
          return <li key={i}>{country.name.common}</li>
        })}
      </ul>
      }
    </div>
  )
}

const CountryDetails = ({country}) => {

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {country.capital} <br/> area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.keys(country.languages).map((lang, i) => {
          return <li key={i}>{country.languages[lang]}</li>
        })}
      </ul>
      <img className="flag" src={country.flags.svg} alt="flag"/>
    </div>
  )
}

const App = () => {

  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [filter, setFilter] = useState("")

  useEffect(() => {
    countryService
      .getAll()
      .then(c => {
        setCountries(c)
      })
  }, [])

  if (!countries) return null

  return (
    <div>
      <Filter filter={filter} setFilter={setFilter}/>
      <Country countries={countries} filteredCountries={filteredCountries} setFilteredCountries={setFilteredCountries} filter={filter} />
    </div>
  )
}

export default App;

import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [allCountries, setAllCountries] = useState(null)
  const [countriesFilterText, setCountriesFilterText] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setAllCountries(response.data))
  }, [])
  if (!allCountries)
  {
    return null
  }
  
  const handleCountriesFilterChange = (event) => {
    setCountriesFilterText(event.target.value)
  }
  
  const filteredCountries = allCountries.filter(c => (
    c.name.common.toLowerCase().includes(countriesFilterText.toLowerCase())
  ))

  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    
    return (
      <div>
        find countries <input value={countriesFilterText} onChange={handleCountriesFilterChange} />
        <div>
          <h2>{country.name.common}</h2>
          <p>Capital {country.capital}</p>
          <p>Area {country.area}</p>

          <h2>Languages</h2>
          <ul>
            {Object.entries(country.languages).map(([abbrv, lang]) =>
              <li key={abbrv}>{lang}</li>
            )}
          </ul>
          <img src={country.flags.png} alt={country.flags.alt} width="200" height="150" />
        </div>
      </div>
    )
  }
  
  if (filteredCountries.length > 10) {
    return (
      <div>
        find countries <input value={countriesFilterText} onChange={handleCountriesFilterChange} />
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  // 1 < filteredCountries.length < 10
  return (
    <div>
      find countries <input value={countriesFilterText} onChange={handleCountriesFilterChange} />
      <div>
        {filteredCountries.map(country =>
          <p key={country.flag}>{country.name.common}</p>
        )}
      </div>
    </div>
  )
}

export default App
// name, capital, area, languages spoken, flag

import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import CountryInfo from './components/CountryInfo'

const App = () => {
  const [allCountries, setAllCountries] = useState(null)
  const [countriesFilterText, setCountriesFilterText] = useState('')
  const [selectedCountryFlag, setSelectedCountryFlag] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setAllCountries(response.data))
  }, [])
  if (!allCountries) {
    return (
      <div>
        Loading...
      </div>
    )
  }
  
  const handleCountriesFilterChange = (event) => {
    setCountriesFilterText(event.target.value)
    setSelectedCountryFlag(null)
  }

  const handleShowClick = (countryFlag) => {
    setSelectedCountryFlag(countryFlag)
  }
  
  const filteredCountries = allCountries.filter(c => (
    c.name.common.toLowerCase().includes(countriesFilterText.toLowerCase())
  ))
  if (filteredCountries.length > 10) {
    return (
      <div>
        find countries <input value={countriesFilterText} onChange={handleCountriesFilterChange} />
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  let country = null
  if (selectedCountryFlag) {
    country = allCountries.find(c => c.flag === selectedCountryFlag)
  }
  else if (filteredCountries.length === 1) {
    country = filteredCountries[0]
  }
    
  return (
    <div>
      find countries <input value={countriesFilterText} onChange={handleCountriesFilterChange} />
      {country
        ?
        <CountryInfo
          commonName={country.name.common}
          capital={country.capital}
          area={country.area}
          languages={country.languages}
          flags={country.flags}
        />
        : 
        // 0 U 1 < filteredCountries.length < 10
        <Countries countries={filteredCountries} handleShowClick={handleShowClick} />
      }
    </div>
  )
}

export default App
// name, capital, area, languages spoken, flag

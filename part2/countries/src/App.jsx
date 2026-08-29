import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import CountryInfo from './components/CountryInfo'

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY

const App = () => {
  const [allCountries, setAllCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState([])
  const [countriesFilterText, setCountriesFilterText] = useState('')
  const [country, setCountry] = useState(null)
  const [weatherData, setWeatherData] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => setAllCountries(response.data))
  }, [])

  useEffect(() => {
    if (!country) {
      return
    }
    setWeatherData(null)  // to prevent race conditions
    axios
      .get('http://api.openweathermap.org/data/2.5/weather?' +
        `q=${country.capital[0]}&units=metric&APPID=${weatherApiKey}`)
      .then(response => setWeatherData(response.data))
  }, [country])
  
  if (!allCountries) {
    return (
      <div>
        Loading...
      </div>
    )
  }
  
  const handleCountriesFilterChange = (event) => {
    const newFilterText = event.target.value
    const newFilteredCountries = allCountries.filter(c => (
      c.name.common.toLowerCase().includes(newFilterText.toLowerCase())
    ))
    setCountriesFilterText(newFilterText)
    setFilteredCountries(newFilteredCountries)
    setCountry(newFilteredCountries.length === 1 ? newFilteredCountries[0] : null)
  }

  const handleShowClick = (countryFlag) => {
    setCountry(allCountries.find(c => c.flag === countryFlag))
  }
  
  if (filteredCountries.length > 10) {
    return (
      <div>
        find countries <input value={countriesFilterText} onChange={handleCountriesFilterChange} />
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  return (
    <div>
      find countries <input value={countriesFilterText} onChange={handleCountriesFilterChange} />
      {country
        ?
        <div>
          <CountryInfo
            commonName={country.name.common}
            capital={country.capital}  // can be multiple capitals...
            area={country.area}
            languages={country.languages}
            flags={country.flags}
            weatherData={weatherData}
          />
        </div>
        : 
        // 0 U 2 <= filteredCountries.length <= 10
        <Countries countries={filteredCountries} handleShowClick={handleShowClick} />
      }
    </div>
  )
}

export default App

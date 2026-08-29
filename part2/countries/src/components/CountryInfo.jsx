import Weather from "./Weather"

const CountryInfo = (props) => (
  <div>
    <h2>{props.commonName}</h2>
    {props.capital.length > 1
      ? <p>Capitals {props.capital.join(', ')}</p>
      : <p>Capital {props.capital}</p>
    }
    <p>Area {props.area}</p>

    <h2>Languages</h2>
    <ul>
      {Object.entries(props.languages).map(([abbrv, lang]) =>
        <li key={abbrv}>{lang}</li>
      )}
    </ul>
    <img src={props.flags.png} alt={props.flags.alt} width='200' height='150' />

    <h2>Weather in {props.commonName} ({props.capital[0]})</h2>
    {props.weatherData
      ?
      <Weather
        temp={props.weatherData.main.temp}
        weather={props.weatherData.weather[0]}  // icon
        wind={props.weatherData.wind}
      />
      :
      <p>Loading weather data...</p>
    }
  </div>
)

export default CountryInfo

const CountryInfo = (props) => {
  return (
    <div>
      <h2>{props.commonName}</h2>
      <p>Capital {props.capital}</p>
      <p>Area {props.area}</p>

      <h2>Languages</h2>
      <ul>
        {Object.entries(props.languages).map(([abbrv, lang]) =>
          <li key={abbrv}>{lang}</li>
        )}
      </ul>
      <img src={props.flags.png} alt={props.flags.alt} width="200" height="150" />
    </div>
  )
}

export default CountryInfo

const Country = (props) => (
  <div>
    <span>{props.name}</span>
    &nbsp;
    <button onClick={props.onShowClick}>show</button>
  </div>
)

const Countries = ({ countries, handleShowClick }) => {
  return (
    <div>
      {countries.map(country =>
        <Country
          key={country.flag}
          name={country.name.common}
          onShowClick={() => handleShowClick(country.flag)}
         />
      )}
    </div>
  )
}

export default Countries

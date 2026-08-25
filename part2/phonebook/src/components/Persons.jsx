const Person = (props) => (
  <p>{props.name} {props.number}</p>
)

const Persons = (props) => {
  const { persons } = props

  return (
    <div>
      {persons.map(person =>
        <Person key={person.name} name={person.name} number={person.number} />
      )}
    </div>
  )
}

export default Persons;

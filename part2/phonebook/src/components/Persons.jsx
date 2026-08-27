const Person = (props) => (
  <div>
    <span>{props.name} {props.number}</span>
    &nbsp;
    <button onClick={props.onDeleteClick}>delete</button>
  </div>
)

const Persons = (props) => {
  const { persons, deletePerson } = props

  return (
    <div>
      {persons.map(person =>
        <Person
          key={person.id}
          name={person.name}
          number={person.number}
          onDeleteClick={() => deletePerson(person.id)}
        />
      )}
    </div>
  )
}

export default Persons;

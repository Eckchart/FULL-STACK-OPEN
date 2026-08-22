const Header = (props) => <h2>{props.course}</h2>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = (props) => (
  <div>
    {props.parts.map(part =>
      <Part key={part.id} part={part} />
    )}
  </div>
)

const Total = (props) => <b>total of {props.total} exercises</b>

const Course = (props) => {
  const total = props.course.parts.reduce(
    (accumulator, cur_value) => accumulator + cur_value.exercises,
    0);

  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total total={total} />
    </div>
  )
}

export default Course;

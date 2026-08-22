const Header = (props) => <h1>{props.course}</h1>

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Content = (props) => (
  <div>
    {props.parts.map(part =>
      <Part key={part.name} part={part} />
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

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
      },
      {
        name: 'State of a component',
        exercises: 14,
      },
      {
        name: 'Redux',
        exercises: 11
      }
    ],
  }

  return <Course course={course} />
}

export default App

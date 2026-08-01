const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    )
}

const Part = (props) => {
    return (
        <div>
            <p>{props.part} {props.nrExercises}</p>
        </div>
    )
}

const Content = (props) => {
    return (
        <div>
            <Part part={props.parts[0]} nrExercises={props.nrExercises[0]} />
            <Part part={props.parts[1]} nrExercises={props.nrExercises[1]} />
            <Part part={props.parts[2]} nrExercises={props.nrExercises[2]} />
        </div>
    )
}

const Total = (props) => {
    return (
        <div>
            <p>Number of exercises {props.totalNrExercises}</p>
        </div>
    )
}

const App = () => {
    const course = 'Half Stack application development'
    const part1 = 'Fundamentals of React'
    const exercises1 = 10
    const part2 = 'Using props to pass data'
    const exercises2 = 7
    const part3 = 'State of a component'
    const exercises3 = 14

    return (
        <div>
            <Header course={course} />
            <Content parts={[part1, part2, part3]} nrExercises={[exercises1, exercises2, exercises3]} />
            <Total totalNrExercises={exercises1 + exercises2 + exercises3} />
        </div>
    )
}

export default App

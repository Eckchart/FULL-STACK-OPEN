const Header = (props) => {
    return (
        <div>
            <h1>{props.course}</h1>
        </div>
    )
}

const Content = (props) => {
    return (
        <div>
            <p>{props.parts[0]} {props.nrExercises[0]}</p>
            <p>{props.parts[1]} {props.nrExercises[1]}</p>
            <p>{props.parts[2]} {props.nrExercises[2]}</p>
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

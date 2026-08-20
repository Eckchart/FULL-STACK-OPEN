import { useState } from 'react'

const Statistics = (props) => {
    const totalFeedback = props.good + props.neutral + props.bad
    const avgScore = totalFeedback ? (props.good - props.bad) / totalFeedback : "undefined"
    const positiveFeedbackPercentage = totalFeedback ? 100 * props.good / totalFeedback + "%" : "undefined"

    return (
        <div>
            <h2>statistics</h2>
            <p>good {props.good}</p>
            <p>neutral {props.neutral}</p>
            <p>bad {props.bad}</p>
            <p>all {totalFeedback}</p>
            <p>average {avgScore}</p>
            <p>positive {positiveFeedbackPercentage}</p>
        </div>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGoodClick = () => setGood(good + 1)

    const handleNeutralClick = () => setNeutral(neutral + 1)

    const handleBadClick = () => setBad(bad + 1)

    return (
        <div>
            <h2>give feedback</h2>
            <button onClick={handleGoodClick}>good</button>
            <button onClick={handleNeutralClick}>neutral</button>
            <button onClick={handleBadClick}>bad</button>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App

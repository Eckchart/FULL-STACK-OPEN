import { useState } from 'react'

const StatisticLine = (props) => (
    <tr>
        <td>{props.text}</td>
        <td>{props.value}</td>
    </tr>
)

const Statistics = (props) => {
    const totalFeedback = props.good + props.neutral + props.bad
    const avgScore = (props.good - props.bad) / totalFeedback
    const positiveFeedbackPercentage = 100 * props.good / totalFeedback + "%"

    return (
        <div>
            <h2>statistics</h2>
            {totalFeedback === 0 ? (
                <p>No feedback given</p>
            ) : (
                <table>
                    <tbody>
                        <StatisticLine text="good" value={props.good} />
                        <StatisticLine text="neutral" value={props.neutral} />
                        <StatisticLine text="bad" value={props.bad} />
                        <StatisticLine text="all" value={totalFeedback} />
                        <StatisticLine text="average" value={avgScore} />
                        <StatisticLine text="positive" value={positiveFeedbackPercentage} />
                    </tbody>
                </table>
            )}
        </div>
    )
}
    
const Button = (props) => (
    <button onClick={props.onClick}>{props.text}</button>
)

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
            <Button text="good" onClick={handleGoodClick} />
            <Button text="neutral" onClick={handleNeutralClick} />
            <Button text="bad" onClick={handleBadClick} />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App

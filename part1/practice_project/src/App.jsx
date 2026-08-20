import { useState } from 'react'

const History = (props) => {
    if (props.allClicks.length === 0) {
        return (
            <div>
                the app is used by pressing the buttons
            </div>
        )
    }

    return (
        <div>
            button press history: {props.allClicks.join(' ')}
        </div>
    )
}

const Button = (props) => (
    <button onClick={props.onClick}>
        {props.text}
    </button>
)

const Display = props => <div>{props.value}</div>

const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () => {
    console.log('clicked the button')
    setValue(0)
  }
  
  const hello = (who) => () => console.log("hello world", who)

  const setToValue = (newValue) => () => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  const setToValue2 = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
        <Display value={value} />
        <Button onClick={() => setToValue2(1000)} text="thousand" />
        <Button onClick={() => setToValue2(0)} text="reset" />
        <Button onClick={() => setToValue2(value + 1)} text="increment" />
    </div>
  )
}

export default App

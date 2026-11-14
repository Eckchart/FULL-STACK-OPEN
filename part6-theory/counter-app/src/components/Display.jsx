import { useValues } from '../store'

const Display = () => {
  const { counter } = useValues()

  return (
    <div>{counter}</div>
  )
}

export default Display

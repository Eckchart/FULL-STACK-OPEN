import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [isVisible, setIsVisible] = useState(false)

  const showWhenVisible = { display: isVisible ? '' : 'none' }
  const hideWhenVisible = { display: isVisible ? 'none' : '' }

  const toggleVisibility = () => (
    setIsVisible(!isVisible)
  )

  // callback returns an object containing the `toggleVisibility`
  // property (which is a function).
  useImperativeHandle(props.ref, () => ({ toggleVisibility }))

  return (
    <div>
      <div style={showWhenVisible}>
        {props.children}
      </div>

      <button style={hideWhenVisible} onClick={toggleVisibility}>
        {props.buttonLabel}
      </button>

      <button style={showWhenVisible} onClick={toggleVisibility}>cancel</button>
    </div>
  )
}


export default Togglable

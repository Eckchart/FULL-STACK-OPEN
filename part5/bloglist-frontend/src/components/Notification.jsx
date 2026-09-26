const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const notifStyle = {
    color: type === 'success' ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px'
  }

  return (
    <div style={notifStyle}>
      {message}
    </div>
  )
}


export default Notification

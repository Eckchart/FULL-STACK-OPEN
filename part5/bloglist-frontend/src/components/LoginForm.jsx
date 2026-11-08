import { TextField, Button } from '@mui/material'

const LoginForm = (props) => {
  return (
    <div>
      <form onSubmit={props.onLoginSubmit}>
        <TextField
          required
          type="text"
          label="username"
          placeholder="Enter username"
          value={props.newUsername}
          onChange={props.onUsernameChange}
        />
        {' '}
        <TextField
          required
          type="password"
          label="password"
          placeholder="Enter password"
          value={props.newPassword}
          onChange={props.onPasswordChange}
        />

        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            login
          </Button>
        </div>
      </form>
    </div>
  )
}


export default LoginForm

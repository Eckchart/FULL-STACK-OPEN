const LoginForm = (props) => (
  <div>
    <h2>Login</h2>
    <form onSubmit={props.onLoginSubmit}>
      <div>
        <label>
          Username
          &nbsp;
          <input
            type="text"
            value={props.username}
            onChange={props.onUsernameChange}
          />
        </label>
      </div>

      <div>
        <label>
          Password
          &nbsp;
          <input
            type="text"
            value={props.password}
            onChange={props.onPasswordChange}
          />
        </label>
      </div>

      <button type="submit">login</button>
    </form>
  </div>
)


export default LoginForm

const LoginForm = (props) => (
  <div>
    <form onSubmit={props.onLoginSubmit}>
      <div>
        <label>
          username &nbsp;
          <input type="text" value={props.newUsername} onChange={props.onUsernameChange}/>
        </label>
      </div>

      <div>
        <label>
          password &nbsp;
          <input type="text" value={props.newPassword} onChange={props.onPasswordChange}/>
        </label>
      </div>

      <button type="submit">login</button>
    </form>
  </div>
)


export default LoginForm

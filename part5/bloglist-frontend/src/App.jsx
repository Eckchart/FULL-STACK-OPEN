import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))  
  }, [])

  useEffect(() => {
    const userObjJson = window.localStorage.getItem('loggedInUser')
    if (userObjJson) {
      setUser(JSON.parse(userObjJson))
    }
  }, [])

  if (!user && window.localStorage.getItem('loggedInUser')) {
    return null
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    try {
      const userObj = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(userObj))
      setUser(userObj)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('ERROR:', error.message)
    }
  }
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }
  
  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }
  
  if (!user) {
    return (
      <LoginForm
        newUsername={username}
        newPassword={password}
        onUsernameChange={handleUsernameChange}
        onPasswordChange={handlePasswordChange}
        onLoginSubmit={handleLoginSubmit}
      />
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in &nbsp;
        <button onClick={handleLogout}>logout</button>
      </p>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}


export default App

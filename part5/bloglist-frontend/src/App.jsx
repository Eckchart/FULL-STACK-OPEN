import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const userObjJson = window.localStorage.getItem('loggedInUser')
    if (userObjJson) {
      const user = JSON.parse(userObjJson)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  if (!user && window.localStorage.getItem('loggedInUser')) {
    return null
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userObj = await loginService.login({ username, password })

      // log out automatically after 1 hour, when token expires
      setTimeout(handleLogout, 60 * 60 * 1000)

      window.localStorage.setItem('loggedInUser', JSON.stringify(userObj))
      setUser(userObj)
      blogService.setToken(userObj.token)
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
    blogService.setToken(null)
    setUser(null)
  }

  const handleBlogCreation = async (e) => {
    e.preventDefault()
    try {
      const createdBlog = await blogService.create(blog)
      setBlogs(blogs.concat(createdBlog))
      setBlog({
        title: '',
        author: '',
        url: ''
      })
    } catch (error) {
      console.log('ERROR:', error.message)
    }
  }

  if (!user) {
    return (
      <LoginForm
        newUsername={username}
        newPassword={password}
        onUsernameChange={handleUsernameChange}
        onPasswordChange={handlePasswordChange}
        onLoginSubmit={handleLogin}
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

      <BlogForm
        onBlogSubmit={handleBlogCreation}
        blog={blog}
        onTitleChange={(e) => setBlog({ ...blog, title: e.target.value })}
        onAuthorChange={(e) => setBlog({ ...blog, author: e.target.value })}
        onUrlChange={(e) => setBlog({ ...blog, url: e.target.value })}
      />

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}


export default App

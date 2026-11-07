import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(() => {
    const userObjJson = window.localStorage.getItem('loggedInUser')
    return userObjJson ? JSON.parse(userObjJson) : null
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    blogService.setToken(user?.token || null)
  }, [user])

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
      // blogService.setToken(userObj.token)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {
      console.error('ERROR when logging in:', error.message)
      changeNotificationState(`${error.response.data.error}`, 'error')
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
    // blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const addBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      createdBlog.user = user  // very important line
      changeNotificationState(`A new blog '${createdBlog.title}' by `
        + `'${createdBlog.author}' has been added`, 'success')
      setBlogs(blogs.concat(createdBlog))
    } catch (error) {
      console.error('ERROR in blog creation:', error.message)
      changeNotificationState(`${error.response.data.error}`, 'error')
    }
  }

  const updateBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog)
      updatedBlog.user = blog.user
      const newBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      setBlogs(newBlogs)
    } catch (error) {
      console.error('ERROR in blog update:', error.message)
      changeNotificationState(`${error.response.data.error}`, 'error')
    }
  }

  const handleDeleteBlog = async (blogToDelete) => {
    if (!window.confirm(`Remove blog ${blogToDelete.title} by ${blogToDelete.author}`)) {
      return
    }
    try {
      await blogService.destroy(blogToDelete.id)
      const newBlogs = blogs.filter(blog => blog.id !== blogToDelete.id)
      setBlogs(newBlogs)
      navigate('/')
    } catch (error) {
      console.error('ERROR in blog deletion:', error.message)
      changeNotificationState(`${error.response.data.error}`, 'error')
    }
  }

  const changeNotificationState = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5 * 1000)
  }

  const padding = {
    padding: 5
  }

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>

        {user &&
          <>
            <Link style={padding} to="/create">new blog</Link>
            <button onClick={handleLogout}>logout</button>
          </>
        }
        {!user && <Link style={padding} to="/login">login</Link>}
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
      />

      <Routes>
        <Route path="/" element={<BlogList blogs={blogs} />} />

        <Route path="/login" element={
          <LoginForm
            newUsername={username}
            newPassword={password}
            onUsernameChange={handleUsernameChange}
            onPasswordChange={handlePasswordChange}
            onLoginSubmit={handleLogin}
          />
        } />

        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            user={user}
            onDeleteBlog={() => handleDeleteBlog(blog)}
            updateBlog={updateBlog}
          />
        } />

        {user &&
          <Route path="/create" element={
            <BlogForm addBlog={addBlog} />
          } />
        }
      </Routes>
    </div>
  )
}


export default App

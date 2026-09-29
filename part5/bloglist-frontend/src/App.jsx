import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const userObjJson = window.localStorage.getItem('loggedInUser')
    if (userObjJson) {
      const loggedInUser = JSON.parse(userObjJson)
      blogService.setToken(loggedInUser.token)
      setUser(loggedInUser)
    }
  }, [])

  if (blogs.length === 0
      || (!user && window.localStorage.getItem('loggedInUser'))) {
    return null
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userObj = await loginService.login({ username, password })

      // log out automatically after 1 hour, when token expires
      setTimeout(handleLogout, 60 * 60 * 1000)
      changeNotificationState('Logged in successfully', 'success')

      window.localStorage.setItem('loggedInUser', JSON.stringify(userObj))
      setUser(userObj)
      blogService.setToken(userObj.token)
      setUsername('')
      setPassword('')
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
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      createdBlog.user = user
      blogFormRef.current.toggleVisibility()
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

  if (!user) {
    return (
      <div>
        <h2>log in to application</h2>

        <Notification
          message={notification.message}
          type={notification.type}
        />

        <LoginForm
          newUsername={username}
          newPassword={password}
          onUsernameChange={handleUsernameChange}
          onPasswordChange={handlePasswordChange}
          onLoginSubmit={handleLogin}
        />
      </div>
    )
  }

  const blogsSortedByLikes = blogs.toSorted(
    (blog1, blog2) => blog2.likes - blog1.likes
  )

  return (
    <div>
      <h2>blogs</h2>

      <Notification
        message={notification.message}
        type={notification.type}
      />

      <p>
        {user.name} logged in &nbsp;
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="add new blog" ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>

      {blogsSortedByLikes.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          loggedInUser={user}
          onDeleteBlog={() => handleDeleteBlog(blog)}
          updateBlog={updateBlog}
        />
      )}
    </div>
  )
}


export default App

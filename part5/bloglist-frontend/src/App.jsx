import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { Container, AppBar, Toolbar, Button, Box } from '@mui/material'

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

      window.localStorage.setItem('loggedInUser', JSON.stringify(userObj))
      setUser(userObj)
      // blogService.setToken(userObj.token)
      setUsername('')
      setPassword('')
      changeNotificationState('Login successful', 'success')
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
      // changeNotificationState('Blog updated successfully', 'success')
      setBlogs(newBlogs)
    } catch (error) {
      console.error('ERROR in blog update:', error.message)
      changeNotificationState(`${error.response.data.error}`, 'error')
    }
  }

  const handleDeleteBlog = async (blogToDelete) => {
    try {
      await blogService.destroy(blogToDelete.id)
      const newBlogs = blogs.filter(blog => blog.id !== blogToDelete.id)
      setBlogs(newBlogs)
      changeNotificationState('Blog deleted successfully', 'success')
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

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null
  const toolbarButtonStyle = {
    '&:hover': {
      // bgcolor = MUI shorthand for backgroundColor
      bgcolor: '#1A2D3B'
    }
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <h2>Blog App</h2>

          {/* Box is like div */}
          <Box sx={{ ml: 'auto' }}>
            <Button color="inherit" component={Link} to="/" sx={toolbarButtonStyle}>
              blogs
            </Button>

            {user &&
              <>
                <Button color="inherit" component={Link} to="/create" sx={toolbarButtonStyle}>
                  new blog
                </Button>
                <Button color="inherit" onClick={handleLogout} sx={toolbarButtonStyle}>
                  logout
                </Button>
              </>
            }
            {!user &&
              <Button color="inherit" component={Link} to="/login" sx={toolbarButtonStyle}>
                login
              </Button>
            }
          </Box>
        </Toolbar>
      </AppBar>

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
    </Container>
  )
}


export default App

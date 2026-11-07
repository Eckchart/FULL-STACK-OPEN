import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import loginService from './services/login'
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom'
import BlogList from './components/BlogList'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

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
      navigate('/')
    } catch (error) {
      console.error('ERROR when logging in:', error.message)
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
    navigate('/')
  }

  const addBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      createdBlog.user = user
      setBlogs(blogs.concat(createdBlog))
    } catch (error) {
      console.error('ERROR in blog creation:', error.message)
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
    }
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

        {user && <Link style={padding} to="/create">new blog</Link>}
        {user && <button onClick={handleLogout}>logout</button>}
        {!user && <Link style={padding} to="/login">login</Link>}
      </div>

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

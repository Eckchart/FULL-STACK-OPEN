import { useState, useEffect } from 'react'
import Blog from './Blog'
import blogService from '../services/blogs'
import Notification from './Notification'

const BlogList = ({ blogs }) => {
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({
    message: null,
    type: null
  })

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

  const addBlog = async (blog) => {
    try {
      const createdBlog = await blogService.create(blog)
      createdBlog.user = user
      changeNotificationState(`A new blog '${createdBlog.title}' by `
        + `'${createdBlog.author}' has been added`, 'success')
      // setBlogs(blogs.concat(createdBlog))
    } catch (error) {
      console.error('ERROR in blog creation:', error.message)
      changeNotificationState(`${error.response.data.error}`, 'error')
    }
  }

  const updateBlog = async (blog) => {
    try {
      const updatedBlog = await blogService.update(blog)
      updatedBlog.user = blog.user
      // const newBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      // setBlogs(newBlogs)
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
      // const newBlogs = blogs.filter(blog => blog.id !== blogToDelete.id)
      // setBlogs(newBlogs)
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

      {/* <BlogForm addBlog={addBlog} /> */}

      <div className="blogs">
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
    </div>
  )
}


export default BlogList

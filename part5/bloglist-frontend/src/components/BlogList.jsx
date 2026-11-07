import { useState, useEffect } from 'react'
import blogService from '../services/blogs'
import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const [user, _] = useState(() => {
    const userObjJson = window.localStorage.getItem('loggedInUser')
    return userObjJson ? JSON.parse(userObjJson) : null
  })

  useEffect(() => {
    blogService.setToken(user?.token || null)
  }, [user])

  if (!user && window.localStorage.getItem('loggedInUser')) {
    return null
  }

  const blogsSortedByLikes = blogs.toSorted(
    (blog1, blog2) => blog2.likes - blog1.likes
  )

  return (
    <div>
      <h2>blogs</h2>

      <div className="blogs">
        <ul>
          {blogsSortedByLikes.map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {`${blog.title} ${blog.author}`}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}


export default BlogList

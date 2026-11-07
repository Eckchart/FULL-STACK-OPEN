import { useState } from 'react'

// if `user` is null, that means they are not logged in,
// otherwise `user` represents the currently logged-in user.
const Blog = ({ blog, user, updateBlog, onDeleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

  if (!blog) {
    return null
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const incrementLikes = async () => {
    const newBlogObj = { ...blog, likes: blog.likes + 1 }
    await updateBlog(newBlogObj)
  }

  return (
    <div style={blogStyle}>
      <div>
        <span>{blog.title}</span>
        {' '}
        <span>{blog.author}</span>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails &&
        <>
          <span>{blog.url}</span>
          <div>
            {blog.likes}
            {user && <button onClick={incrementLikes}>like</button>}
          </div>
          {blog.user.name}

          {user && blog.user.username === user.username &&
            <div>
              <button onClick={onDeleteBlog}>remove</button>
            </div>
          }
        </>
      }
    </div>
  )
}


export default Blog

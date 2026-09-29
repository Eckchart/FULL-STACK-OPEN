import { useState } from 'react'

const Blog = ({ blog, loggedInUser, updateBlog, onDeleteBlog }) => {
  const [showDetails, setShowDetails] = useState(false)

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
        {blog.title} {blog.author}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails &&
        <>
          {blog.url}
          <div>
            {blog.likes}
            <button onClick={incrementLikes}>like</button>
          </div>
          {blog.user.name}

          {blog.user.username === loggedInUser.username &&
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

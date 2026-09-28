import { useState } from "react"

const Blog = ({ blog, updateBlog }) => {
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
        {blog.author}
        </>
      }
    </div>  
  )
}


export default Blog

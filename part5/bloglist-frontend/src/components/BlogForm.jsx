import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BlogForm = ({ addBlog }) => {
  const [blog, setBlog] = useState({
    title: '',
    author: '',
    url: ''
  })
  const navigate = useNavigate()

  const handleBlogSubmit = async (e) => {
    e.preventDefault()
    await addBlog(blog)
    setBlog({
      title: '',
      author: '',
      url: ''
    })
    navigate('/')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={handleBlogSubmit}>
        <div>
          <label>
            title: &nbsp;
            <input
              type="text"
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            author: &nbsp;
            <input
              type="text"
              value={blog.author}
              onChange={(e) => setBlog({ ...blog, author: e.target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            url: &nbsp;
            <input
              type="text"
              value={blog.url}
              onChange={(e) => setBlog({ ...blog, url: e.target.value })}
            />
          </label>
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  )
}


export default BlogForm

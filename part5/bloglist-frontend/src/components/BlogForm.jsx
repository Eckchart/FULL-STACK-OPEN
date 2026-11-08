import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Stack } from '@mui/material'

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
        <Stack spacing={2} sx={{ width: '400px', maxWidth: '100%' }}>
          <TextField
            required
            type="text"
            label="title"
            placeholder="Enter title"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          />

          <TextField
            required
            type="text"
            label="author"
            placeholder="Enter author"
            value={blog.author}
            onChange={(e) => setBlog({ ...blog, author: e.target.value })}
          />

          <TextField
            required
            type="text"
            label="url"
            placeholder="Enter url"
            value={blog.url}
            onChange={(e) => setBlog({ ...blog, url: e.target.value })}
          />
        </Stack>

        <div>
          <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
            create
          </Button>
        </div>
      </form>
    </div>
  )
}


export default BlogForm

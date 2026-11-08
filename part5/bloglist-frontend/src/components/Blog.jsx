import { Stack, Typography, Paper, Link, Button } from '@mui/material'

// if `user` is null, that means they are not logged in,
// otherwise `user` represents the currently logged-in user.
const Blog = ({ blog, user, updateBlog, onDeleteBlog }) => {
  if (!blog) {
    return null
  }

  const incrementLikes = async () => {
    const newBlogObj = { ...blog, likes: blog.likes + 1 }
    await updateBlog(newBlogObj)
  }

  const colorStyle = {
    color: 'rgba(0, 0, 0, 0.6)'
  }
  const buttonStyle = {
    width: 90,
    fontWeight: 600
  }

  return (
    <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h5">{blog.title}</Typography>

        <Typography sx={colorStyle}>by {blog.author}</Typography>

        <Link href={blog.url} target="_blank" rel="noreferrer">{blog.url}</Link>

        <Typography sx={colorStyle} variant="body2">
          Added by {blog.user.name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ mr: 1 }}>
            {blog.likes} likes
          </Typography>

          <Button variant="outlined" onClick={incrementLikes} sx={buttonStyle}>
            like
          </Button>

          {user && blog.user.username === user.username &&
            <Button variant="outlined" color="error" onClick={onDeleteBlog} sx={buttonStyle}>
              remove
            </Button>
          }
        </Stack>
      </Stack>
    </Paper>
  )
}


export default Blog

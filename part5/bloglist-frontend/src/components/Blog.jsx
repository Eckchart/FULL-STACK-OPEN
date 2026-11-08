import { useState } from 'react'
import {
  Stack, Typography, Paper, Link, Button, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material'

// if `user` is null, that means they are not logged in,
// otherwise `user` represents the currently logged-in user.
const Blog = ({ blog, user, updateBlog, onDeleteBlog }) => {
  const [openDialog, setOpenDialog] = useState(false)
  if (!blog) {
    return null
  }

  const incrementLikes = async () => {
    const newBlogObj = { ...blog, likes: blog.likes + 1 }
    await updateBlog(newBlogObj)
  }

  const handleDelete = () => {
    onDeleteBlog()
    setOpenDialog(false)
  }

  const hoverStyle = {
    '&:hover': {
      bgcolor: 'rgba(0, 0, 0, 0.1)'
    }
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

        {/* noreferrer includes noopener behavior in modern browsers;
          * using noopener for compatibility with older browsers.
          */}
        <Link href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</Link>

        <Typography sx={colorStyle} variant="body2">
          Added by {blog.user.name}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography sx={{ mr: 1 }}>
            {blog.likes} likes
          </Typography>

          {user &&
            <Button variant="outlined" onClick={incrementLikes} sx={buttonStyle}>
              like
            </Button>
          }

          {user && blog.user.username === user.username &&
            <Button variant="outlined" color="error" onClick={() => setOpenDialog(true)} sx={buttonStyle}>
              remove
            </Button>
          }
        </Stack>
      </Stack>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Remove blog</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Remove blog <strong>{blog.title}</strong> by {blog.author}?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} sx={hoverStyle}>cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>remove</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}


export default Blog

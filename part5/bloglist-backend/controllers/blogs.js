const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const user = req.user  // the user who added the blog
  const blog = new Blog(req.body)
  blog.user = user._id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  // the user identified by the token, who wants to delete
  // the blog with the given id (so it could be a
  // user who is not authorized to do so)
  const user = req.user
  const blogId = req.params.id
  const blog = await Blog.findById(blogId)
  if (!blog) {
    // the case where the id is invalid (i.e. malformed)
    // is handled in our error handler middleware.
    return res.status(404).json({ error: 'blog not found' })
  }

  // if you don't use toString() for both ObjectIds, we
  // need to compare them with `.equals()`, NOT `!==`
  if (blog.user.toString() !== user._id.toString()) {
    return res.status(401).json({ error: 'unauthorized operation' })
  }
  await blog.deleteOne()
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  // the user that made this PUT request
  const user = req.user
  const blogId = req.params.id
  const newBlogValues = req.body
  const blogToUpdate = await Blog.findById(blogId)
  if (!blogToUpdate) {
    return res.status(404).json({ error: 'blog not found' })
  }
  if (user._id.toString() !== blogToUpdate.user.toString()) {
    return res.status(401).json({ error: 'unauthorized operation' })
  }
  
  blogToUpdate.title  = newBlogValues.title
  blogToUpdate.author = newBlogValues.author
  blogToUpdate.url    = newBlogValues.url
  blogToUpdate.likes  = newBlogValues.likes
  const updatedBlog = await blogToUpdate.save()
  res.json(updatedBlog)
})


module.exports = blogsRouter

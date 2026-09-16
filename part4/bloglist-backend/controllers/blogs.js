const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)
  const randomUser = await User.findOne({})

  blog.user = randomUser._id
  const savedBlog = await blog.save()

  randomUser.blogs = randomUser.blogs.concat(savedBlog._id)
  await randomUser.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  await Blog.findByIdAndDelete(id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const newBlogValues = req.body
  const blogToUpdate = await Blog.findById(id)
  if (!blogToUpdate) {
    return res.status(404).end()
  }
  blogToUpdate.title  = newBlogValues.title
  blogToUpdate.author = newBlogValues.author
  blogToUpdate.url    = newBlogValues.url
  blogToUpdate.likes  = newBlogValues.likes
  const updatedBlog = await blogToUpdate.save()
  res.json(updatedBlog)
})


module.exports = blogsRouter

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  await Blog.findByIdAndDelete(id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const newBlogValues = request.body
  const blogToUpdate = await Blog.findById(id)
  if (!blogToUpdate) {
    return response.status(404).end()
  }
  blogToUpdate.title  = newBlogValues.title
  blogToUpdate.author = newBlogValues.author
  blogToUpdate.url    = newBlogValues.url
  blogToUpdate.likes  = newBlogValues.likes
  const updatedBlog = await blogToUpdate.save()
  response.json(updatedBlog)
})


module.exports = blogsRouter

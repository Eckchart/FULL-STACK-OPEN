const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


test('all blog posts are returned in JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is named `id`', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  response.body.forEach(blog => assert(blog.id) && assert(blog._id === undefined))
})

test('a valid blog can be correctly added', async () => {
  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    url: "url",
    likes: 69
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAfter = await api.get('/api/blogs')
  assert.strictEqual(blogsAfter.body.length, helper.initialBlogs.length + 1)
  assert(blogsAfter.body.some(blog => blog.title === newBlog.title))
})

test('if the `likes` property is missing from the request, it defaults to 0', async () => {
  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    url: "url",
  }
  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const addedBlog = await Blog.findById(result.body.id)
  assert.strictEqual(addedBlog.likes, 0)
})

test('if the `title` property is missing from the request, backend responds with status code 400', async () => {
  const newBlog = {
    author: "testAuthor",
    url: "url",
    likes: 69
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('if the `url` property is missing from the request, backend responds with status code 400', async () => {
  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    likes: 69
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})


after(async () => {
  await mongoose.connection.close()
})

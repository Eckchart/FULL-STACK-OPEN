const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  for (const user of helper.initialUsers) {
    // need to make a POST request for every user in
    // order to have a password hash for every user
    await api
      .post('/api/users')
      .send(user)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  }
  const users = await User.find({})
  for (const blog of helper.initialBlogs) {
    const blogObject = new Blog(blog)
    const curUser = users[Math.floor(Math.random() * users.length)]

    blogObject['user'] = curUser.id
    await blogObject.save()

    curUser.blogs = curUser.blogs.concat(blogObject._id)
    await curUser.save()
  }
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
  const userData = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password
  }
  const loginResponse = await api
    .post('/api/login')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    url: "url",
    likes: 69
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAfter = await helper.getAllBlogsInJson()
  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)
  assert(blogsAfter.some(blog => blog.title === newBlog.title))
})

test('adding a valid blog fails if a token is not provided', async () => {
  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    url: "url",
    likes: 69
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('when adding a blog, if the `likes` property is missing, it defaults to 0', async () => {
  const userData = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password
  }
  const loginResponse = await api
    .post('/api/login')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    url: "url",
  }
  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const addedBlog = await Blog.findById(result.body.id)
  assert.strictEqual(addedBlog.likes, 0)
})

test('adding a blog without the `title` property fails', async () => {
  const userData = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password
  }
  const loginResponse = await api
    .post('/api/login')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newBlog = {
    author: "testAuthor",
    url: "url",
    likes: 69
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('adding a blog without the `url` property fails', async () => {
  const userData = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password
  }
  const loginResponse = await api
    .post('/api/login')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newBlog = {
    title: "testTitle",
    author: "testAuthor",
    likes: 69
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('deletion of a blog succeeds with status 204 if id is valid', async () => {
  const userData = {
    username: helper.initialUsers[0].username,
    password: helper.initialUsers[0].password
  }
  const loginResponse = await api
    .post('/api/login')
    .send(userData)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  
  const blogData = {
    title: "testTitle",
    author: "testAuthor",
    url: "url",
    likes: 69
  }
  const addedBlog = await api
    .post('/api/blogs')
    .send(blogData)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogToDelete = addedBlog.body
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${loginResponse.body.token}`)
    .expect(204)

  const blogsAtEnd = await helper.getAllBlogsInJson()

  // added one blog and removed it, so length is the same
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  const blogsAtEndIds = blogsAtEnd.map(blog => blog.id)
  assert(!blogsAtEndIds.includes(blogToDelete.id))
})

test('updating the information of an existing blog post works correctly', async () => {
  const jsonBlogs = await helper.getAllBlogsInJson()
  const blogToUpdate = jsonBlogs[0]
  const newDataOfBlog = {
    title: "NewTitle",
    author: "NewAuthor",
    url: "NewUrl",
    likes: 6969
  }
  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newDataOfBlog)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.id, blogToUpdate.id)
  assert.strictEqual(response.body.likes, newDataOfBlog.likes)
  const blogsAtEnd = await helper.getAllBlogsInJson()
  const blogsAtEndLikes = blogsAtEnd.map(blog => blog.likes)
  assert(blogsAtEndLikes.includes(newDataOfBlog.likes))
})


after(async () => {
  await mongoose.connection.close()
})

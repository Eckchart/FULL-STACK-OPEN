const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "title1",
    author: "author1",
    url: "url1",
    likes: 1,
    user: null
  },
  {
    title: "title2",
    author: "author2",
    url: "url2",
    likes: 2,
    user: null
  }
]
const initialUsers = [
  {
    username: 'test_username1',
    name: 'test_name1',
    password: 'test_password2',
    blogs: []
  },
  {
    username: 'test_username2',
    name: 'test_name2',
    password: 'test_password2',
    blogs: []
  }
]

const getAllBlogsInJson = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const getAllUsersInJson = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


module.exports = { initialBlogs, initialUsers, getAllBlogsInJson, getAllUsersInJson }

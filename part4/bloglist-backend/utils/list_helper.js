const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogsList) => {
  return blogsList.reduce((acc, curBlog) => acc + curBlog.likes, 0)
}

const favoriteBlog = (blogsList) => {
  if (blogsList.length === 0) {
    return null
  }
  const maxLikes = blogsList.reduce(
    (maxSoFar, curBlog) => Math.max(maxSoFar, curBlog.likes),
    -Infinity
  )
  return blogsList.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogsList) => {
  const blogsGroupedByAuthor = _.groupBy(blogsList, 'author')
  const authorsWithNrBlogs = Object.entries(blogsGroupedByAuthor)
    // the parentheses before '{' and after '}' are required
    .map(([author, blogsOfAuthor]) => ({ author, blogs: blogsOfAuthor.length }))
  return _.maxBy(authorsWithNrBlogs, 'blogs') || null
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}

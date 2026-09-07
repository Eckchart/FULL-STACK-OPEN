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
  const maxLikes = blogsList.reduce((maxSoFar, curBlog) =>
    Math.max(maxSoFar, curBlog.likes), -Infinity
  )
  return blogsList.find(blog => blog.likes === maxLikes)
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}

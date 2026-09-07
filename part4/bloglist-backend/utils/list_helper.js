const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogsList) => {
  return blogsList.reduce((acc, curBlog) => acc + curBlog.likes, 0)
}


module.exports = {
  dummy,
  totalLikes
}

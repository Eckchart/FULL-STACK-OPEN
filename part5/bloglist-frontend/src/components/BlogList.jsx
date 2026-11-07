import { Link } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  const blogsSortedByLikes = blogs.toSorted(
    (blog1, blog2) => blog2.likes - blog1.likes
  )

  return (
    <div>
      <h2>blogs</h2>

      <div className="blogs">
        <ul>
          {blogsSortedByLikes.map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>
                {`${blog.title} ${blog.author}`}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}


export default BlogList

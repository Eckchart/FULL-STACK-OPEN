const BlogForm = (props) => (
  <div>
    <h2>create new</h2>
    <form onSubmit={props.onBlogSubmit}>
      <div>
        <label>
          title: &nbsp;
          <input type="text" value={props.blog.title} onChange={props.onTitleChange}/>
        </label>
      </div>
      <div>
        <label>
          author: &nbsp;
          <input type="text" value={props.blog.author} onChange={props.onAuthorChange}/>
        </label>
      </div>
      <div>
        <label>
          url: &nbsp;
          <input type="text" value={props.blog.url} onChange={props.onUrlChange}/>
        </label>
      </div>
    
      <button type="submit">create</button>
    </form>
  </div>
)


export default BlogForm

const BlogForm = ({ 
  handleLogout, 
  user, 
  hideWhenVisible, 
  setblogFormVisible,
  showWhenVisible,
  addBlog,
  newBlogTitle,
  handleTitleChange,
  newBlogAuthor,
  handleAuthorChange,
  newBlogUrl,
  handleUrlChange
 }) => {
  return (
    <div>
      <form onSubmit={handleLogout}>
        <p>{user.name} logged in <button type='submit'>Log out</button></p>
      </form>
      <button style={hideWhenVisible} onClick={() => setblogFormVisible(true)}>new blog</button>
      <div style={showWhenVisible}>
        <h2>Create new</h2>
        <form onSubmit={addBlog}>
          <div>
          <div>
            title:  
            <input type="text" value={newBlogTitle} onChange={handleTitleChange}/>
          </div>
          <div>
            author:  
            <input type="text" value={newBlogAuthor} onChange={handleAuthorChange}/>
          </div>
            url:  
            <input type="text" value={newBlogUrl} onChange={handleUrlChange}/>
          </div>
          <button type="submit">create</button>
        </form>
        <button onClick={() => setblogFormVisible(false)}>cancel</button>
      </div>
    </div>
  )
}

export default BlogForm
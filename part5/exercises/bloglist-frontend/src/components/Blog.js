import { useState } from "react"

const Blog = ({ user, blog, likeBlog, delBlog }) => {

  const [fullBlogVisible, setFullBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: fullBlogVisible ? "none" : "" }
  const showWhenVisible = { display: fullBlogVisible ? "" : "none" }
  const showDelete = { display: ((user.username === blog.user.username) && fullBlogVisible) ? "" : "none" }

  const addLike = (event) => {
    event.preventDefault()

    const updatedBlog = {
      id: blog.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user
    }

    likeBlog(blog.id, updatedBlog)
  }

  const deleteBlog = (event) => {
    event.preventDefault()
    delBlog(blog.id, blog)
  }

  return (
    <div style={blogStyle}>
      <div className="title-author">
        {blog.title} {blog.author} <button id="view-button" onClick={() => setFullBlogVisible(true)} style={hideWhenVisible}>view</button>
      </div>
      <button onClick={() => setFullBlogVisible(false)} style={showWhenVisible}>hide</button>
      <div style={showWhenVisible} className="url">
        {blog.url}
      </div>
      <div style={showWhenVisible} className="likes">
        likes {blog.likes} <button id="like-button" onClick={addLike}>like</button>
      </div>
      <div style={showWhenVisible} className="user">
        {blog.user.name}
      </div>
      <button style={showDelete} onClick={deleteBlog}>delete</button>
    </div>
  )
}

export default Blog
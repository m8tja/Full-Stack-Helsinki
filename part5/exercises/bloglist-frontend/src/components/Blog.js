import { useState } from "react"

const Blog = ({blog}) => {
 
  const [fullBlogVisible, setFullBlogVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: fullBlogVisible ? "none" : "" }
  const showWhenVisible = { display: fullBlogVisible ? "" : "none" }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author} <button onClick={() => setFullBlogVisible(true)} style={hideWhenVisible}>view</button>
      <button onClick={() => setFullBlogVisible(false)} style={showWhenVisible}>hide</button>
      <div style={showWhenVisible}>
        {blog.url}
      </div>
      <div style={showWhenVisible}>
        likes {blog.likes} <button>like</button>
      </div>
    </div> 
  )
}

export default Blog
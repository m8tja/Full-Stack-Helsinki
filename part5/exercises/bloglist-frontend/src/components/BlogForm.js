import { useState } from "react"

const BlogForm = ({ 
  hideWhenVisible, 
  setblogFormVisible,
  showWhenVisible,
  createBlog,
  setErrorType,
  setErrorMessage
 }) => {

  const [newBlogTitle, setNewBlogTitle] = useState("")
  const [newBlogAuthor, setNewBlogAuthor] = useState("")
  const [newBlogUrl, setNewBlogUrl] = useState("")

  const handleTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    })

    setErrorType("green")
    setErrorMessage(
      `A new blog ${newBlogTitle} by ${newBlogAuthor} added`
    )
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)

    setNewBlogTitle("")
    setNewBlogAuthor("")
    setNewBlogUrl("")
  }

  return (
    <div>
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
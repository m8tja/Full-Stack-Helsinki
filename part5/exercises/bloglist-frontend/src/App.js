import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from "./services/login"
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState("")
  const [newBlogAuthor, setNewBlogAuthor] = useState("")
  const [newBlogUrl, setNewBlogUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [errorType, setErrorType] = useState("")
  const [blogFormVisible, setblogFormVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")

    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))

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
      })
  }

  const handleTitleChange = (event) => {
    setNewBlogTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewBlogAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewBlogUrl(event.target.value)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        "loggedBlogAppUser", JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    }
    catch (exception) {
      setErrorType("red")
      setErrorMessage("Wrong username or password")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try {
      window.localStorage.removeItem("loggedBlogAppUser")
      setUser(null)
    }
    catch (exception) {
      console.log(exception)
    }
  }

  const loginForm = () => (
    <div>
      <h2>Log in to the application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password
          <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const hideWhenVisible = { display: blogFormVisible ? "none" : "" }
  const showWhenVisible = { display: blogFormVisible ? "" : "none" }

  const blogForm = () => (
    <div>
      <BlogForm 
        handleLogout={handleLogout}
        user={user}
        hideWhenVisible={hideWhenVisible}
        setblogFormVisible={setblogFormVisible}
        showWhenVisible={showWhenVisible}
        addBlog={addBlog}
        newBlogTitle={newBlogTitle}
        newBlogAuthor={newBlogAuthor}
        newBlogUrl={newBlogUrl}
        handleAuthorChange={handleAuthorChange}
        handleTitleChange={handleTitleChange}
        handleUrlChange={handleUrlChange}
      />
      {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={errorMessage} errorType={errorType}/>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App
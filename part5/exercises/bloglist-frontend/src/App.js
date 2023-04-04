import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from "./services/login"
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
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

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
  }

  const addLike = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
      })
  }

  const deleteBlog = (id, blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      blogService
      .deleteBlog(id, user)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
      })
    }
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
      <form onSubmit={handleLogout}>
        <p>{user.name} logged in <button type='submit'>Log out</button></p>
      </form>
      <BlogForm 
        hideWhenVisible={hideWhenVisible}
        setblogFormVisible={setblogFormVisible}
        showWhenVisible={showWhenVisible}
        createBlog={addBlog}
        setErrorType={setErrorType}
        setErrorMessage={setErrorMessage}
      />
      {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} user={user} blog={blog} likeBlog={addLike} delBlog={deleteBlog}/>
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
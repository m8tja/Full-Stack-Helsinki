import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from "./services/login"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState("")
  const [newBlogAuthor, setNewBlogAuthor] = useState("")
  const [newBlogUrl, setNewBlogUrl] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

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
      console.log(exception) // TO DO: error message
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

  const blogForm = () => (
    <div>
      <form onSubmit={handleLogout}>
        <p>{user.name} logged in <button type='submit'>Log out</button></p>
      </form>
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
      <h2>Blogs</h2>
      {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App
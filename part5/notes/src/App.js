import {useState, useEffect} from "react"
import Note from "./components/Note"
import Notification from "./components/Notification"
import Footer from "./components/Footer"
import LoginForm from "./components/LoginForm"
import noteService from "./services/notes"
import loginService from "./services/login"
import Toggable from "./components/Toggable"
import NoteForm from "./components/NoteForm"

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState("") 
  const [password, setPassword] = useState("")
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser")

    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, []) // [] means that the effect is executed only when the component is rendered for the first time

  const addNote = (event) => {

    event.preventDefault()

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
  
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })
  }

  const toggleImportanceOf = (id) => {

    //console.log(`importance of ${id} needs to be toggled`)
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note "${note.content}" was already removed from the server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  /*
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }
  */

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        "loggedNoteAppUser", JSON.stringify(user)
      )

      noteService.setToken(user.token)
      setUser(user)
      setUsername("")
      setPassword("")
    }
    catch (exception) {
      setErrorMessage("Wrong credentials")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  
  /* *** could be replaced by conditional ***
  {user === null && loginForm()}
  {user !== null && noteForm()}
  */
  /*
  {user === null ?
    loginForm() :
    noteForm()
  }
  */

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && 
        <Toggable buttonLabel="log in">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Toggable>
      }

      {user &&
        <div>
          <p>{user.name} logged in</p>
          <Toggable buttonLabel="new note">
            <NoteForm createNote={addNote} />
          </Toggable>
        </div>
      }

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all" }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note} 
            toggleImportance={() => toggleImportanceOf(note.id)}  
          />
        )}
      </ul>
      <Footer /> 
    </div>
  )
}

export default App
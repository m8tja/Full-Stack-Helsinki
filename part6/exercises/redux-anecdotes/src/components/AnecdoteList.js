import { useDispatch, useSelector } from "react-redux"
import { addVotes } from "../reducers/anecdoteReducer"
import { setNotification, removeNotification } from "../reducers/notificationReducer"

const _ = require("lodash")

const AnecdoteList = () => {  

  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter))
  })
  const sortedAnecdotes = _.orderBy(anecdotes, "votes", "desc")

  const vote = (id, anecdoteContent) => {
    dispatch(addVotes(id))
    dispatch(setNotification(`you voted '${anecdoteContent}'`))
    setTimeout(() => {
      dispatch(removeNotification())
    }, 5000)
  }

  return (
    <div>
    {sortedAnecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
        </div>
      </div>
    )}
    </div>
  )
}

export default AnecdoteList
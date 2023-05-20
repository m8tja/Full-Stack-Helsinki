import { useDispatch, useSelector } from "react-redux"
import { addVotes } from "../reducers/anecdoteReducer"
const _ = require("lodash")

const AnecdoteList = () => {  

  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    return anecdotes.filter(a => a.content.toLowerCase().includes(filter))
  })
  const sortedAnecdotes = _.orderBy(anecdotes, "votes", "desc")

  const vote = (id) => {
    dispatch(addVotes(id))
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
          <button onClick={() => vote(anecdote.id)}>vote</button>
        </div>
      </div>
    )}
    </div>
  )
}

export default AnecdoteList
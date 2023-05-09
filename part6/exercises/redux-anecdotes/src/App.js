import { useSelector, useDispatch } from 'react-redux'
import { addVotes } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
const _ = require("lodash")

const App = () => {
  const anecdotes = useSelector(state => state)
  const sortedAnecdotes = _.orderBy(anecdotes, "votes", "desc")
  const dispatch = useDispatch()

  const vote = (id) => {
    dispatch(addVotes(id))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
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
      <AnecdoteForm />
    </div>
  )
}

export default App
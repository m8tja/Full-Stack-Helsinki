import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from 'react-redux'
import noteService from "./services/notes"
import noteReducer, { setNotes } from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

noteService.getAll().then(notes => 
  store.dispatch(setNotes(notes)) 
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);


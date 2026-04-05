import { createContext, useReducer } from 'react'

const anecdotesReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      return state
  }
}

const AnecdotesContext = createContext()

export const AnecdotesContextProvider = (props) => {
  const [notification, anecdotesDispatch] = useReducer(anecdotesReducer, '')
  return (
    <AnecdotesContext.Provider value={{ notification, anecdotesDispatch }}>
      {props.children}
    </AnecdotesContext.Provider>
  )
}

export default AnecdotesContext
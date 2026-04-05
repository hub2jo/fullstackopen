import { useContext } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../requests'
import AnecdotesContext from '../AnecdotesContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { anecdotesDispatch } = useContext(AnecdotesContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      anecdotesDispatch({ type: 'SET', payload: `anecdote '${newAnecdote.content}' created` })
      setTimeout(() => {
        anecdotesDispatch({ type: 'CLEAR' })
      }, 5000)
    },
    onError: (error) => {
      anecdotesDispatch({ type: 'SET', payload: error.message })
      setTimeout(() => {
        anecdotesDispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

import { useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdotesContext from './AnecdotesContext'

const App = () => {
  const queryClient = useQueryClient()
  const { anecdotesDispatch } = useContext(AnecdotesContext)

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map((anecdote) => (anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote)))
      anecdotesDispatch({ type: 'SET', payload: `anecdote '${updatedAnecdote.content}' voted` })
      setTimeout(() => {
        anecdotesDispatch({ type: 'CLEAR' })
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1,
    refetchOnWindowFocus: false
  })

  console.log(JSON.parse(JSON.stringify(result)))

  if (result.isPending || result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.isError) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data || [
    {
      content: 'If it hurts, do it more often',
      id: '47145',
      votes: 0,
    },
  ]

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
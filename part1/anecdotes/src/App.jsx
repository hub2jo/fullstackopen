import { useState } from 'react'

const Header = ({header}) => (<h1>{header}</h1>)
const GenerateAnecdote = ({anecdote}) => (<p>{anecdote}</p>)
const Button = ({ onClick, text }) => (<button onClick={onClick}>{text}</button>)
const VoteCount = ({ count }) => (<p>has {count} votes</p>)

const App = () => {
  const header = 'Anecdote of the day'
  const midheader = 'Anecdote with most votes'

  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  
  const max = anecdotes.length 

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(max).fill(0));

  const getRandomInt = (max) => {
    const randomInt = Math.floor(Math.random() * max);
    console.log('random number is', randomInt);
    return randomInt;
  }

  const updateVotes = (index) => {
    const newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
    console.log('the newVotes array values are', newVotes);
    console.log('the Votes array values are', votes);
  };

  const findMaxVotes = (votes) => {
    const maxValue = Math.max(...votes);
    const maxIndex = votes.indexOf(maxValue);
    console.log('max vote index is', maxIndex);
    return maxIndex;
  }

  return (
    <div>
      <Header header={header} />
      <GenerateAnecdote anecdote={anecdotes[selected]} />
      <VoteCount count={votes[selected]} />
      <Button onClick={() => updateVotes(selected)} text='vote' />
      <Button onClick={() => setSelected(getRandomInt(max))} text='next anecdote' />
      <Header header={midheader} />
      <GenerateAnecdote anecdote={anecdotes[findMaxVotes(votes)]} />
      <VoteCount count={votes[findMaxVotes(votes)]} /> 
    </div>
  )
}

export default App
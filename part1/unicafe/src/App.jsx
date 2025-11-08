import { useState } from 'react'

const Header = ({header}) => (<h1>{header}</h1>)
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>

const StatisticLine = ({text, value}) => (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )

const Statistics = (props) => {
  if (props.total === 0) {
    return (
      <div>
        no feedback given
      </div>
    )
  }
  return(
    <table>
      <tbody>
        <StatisticLine text="good" value ={props.score[0]} />
        <StatisticLine text="neutral" value ={props.score[1]} />
        <StatisticLine text="bad" value ={props.score[2]} />
        <StatisticLine text="all" value ={props.total} />
        <StatisticLine text="average" value ={(props.score[0] - props.score[2]) / props.total} />
        <StatisticLine text="positive" value ={(props.score[0] / props.total) * 100 + ' %'} />
      </tbody>
    </table>
  )
}

const App = () => {
  const header = 'Give Feedback'
  const midheader = 'Statistics'

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const score = [good, neutral, bad]
  const total = good + neutral + bad

  return (
    <div>
      <Header header={header} />
      <Button onClick={() => setGood(good + 1)} text='good' />
      <Button onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button onClick={() => setBad(bad + 1)} text='bad' />
      <Header header={midheader} />
      <Statistics score={score} total={total} />

    </div>
  )
}

export default App

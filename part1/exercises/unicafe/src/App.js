import { useState } from "react";

const Title = ({title}) => {

  return (
    <h1>{title}</h1>
  )
}

const Button = (props) => {

  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}

const StatisticsLine = ({text, value}) => {

  if (text === "positive") {
    return (
      <tr>
        <td>{text} {value} %</td>
      </tr>
    )
  }

  return (
    <tr>
      <td>{text} {value}</td>
    </tr>
  )
}

/*
const All = ({array}) => {

  const sum = array[0] + array[1] + array[2]

  return (
    <p>all {sum}</p>
  )
}

const Average = ({array}) => {

  const sum = Math.max(1, array[0] + array[1] + array[2])
  const average = (array[0] - array[2]) / sum

  return (
    <p>average {average}</p>
  )
}

const Positive = ({array}) => {

  const sum = Math.max(1, array[0] + array[1] + array[2])
  const percentage = (array[0] / sum) * 100

  return (
    <p>positive {percentage} %</p>
  )

}
*/

const Statistics = ({good, neutral, bad}) => {

  if (good === 0 && bad === 0 && neutral === 0) {
    return (
      <div>
        <Title title="statistics" />
        <p>No feedback given</p>
      </div>
    )
  }

  const sum = Math.max(1, good + neutral + bad)
  const average = (good - bad) / sum
  const percentage = (good / sum) * 100

  return (
    <div>
      <Title title="statistics" />
      <table>
        <tbody>
          <StatisticsLine text="good" value={good} />
          <StatisticsLine text="neutral" value={neutral} />
          <StatisticsLine text="bad" value={bad} />
          <StatisticsLine text="all" value={sum} />
          <StatisticsLine text="average" value={average} />
          <StatisticsLine text="positive" value={percentage} />
        </tbody>
      </table>
    </div>
  )

}

const App = () => {
 
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <Title title="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )

}

export default App;
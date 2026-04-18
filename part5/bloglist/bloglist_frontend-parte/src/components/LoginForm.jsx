import { useState } from 'react'

import { useNavigate } from 'react-router-dom'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    handleLogin(username, password)
    navigate('/')
    setUsername('')
    setPassword('')
  }

  return (
    <form aria-label="login form" onSubmit={handleSubmit}>
      <div>
        <h2>Log in to Application</h2>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
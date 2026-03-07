import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [error, setError] = useState(false)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
    )
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
    
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNoticeMessage('wrong username or password')
      setError(true)
      setTimeout(() => {
        setNoticeMessage(null)
        setError(false)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    console.log('logging out current user', user.name)
    setUser(null)
    setUsername('')
    setPassword('')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const blogObject = {
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
      }

      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog({ title: '', author: '', url: '' })
      setNoticeMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
      setTimeout(() => {
        setNoticeMessage(null)
      }, 5000)
    } catch (exception) {
      setNoticeMessage(`exception occurred while creating a new blog: ${exception}`)
      setError(true)
      setTimeout(() => {
        setNoticeMessage(null)
        setError(false)
      }, 5000)
    }
  }

  const handleBlogChange = (event) => {
      const { name, value } = event.target;
      setNewBlog({ ...newBlog, [name]: value });
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
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

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <label>title:
        <input name="title" value={newBlog.title} onChange={handleBlogChange} /><br></br>
      </label>
      <label>author:
        <input name="author" value={newBlog.author} onChange={handleBlogChange} /><br></br>
      </label>
      <label>url:
        <input name="url" value={newBlog.url} onChange={handleBlogChange} /><br></br>
      </label>
      <button type="submit">create</button>
    </form>
  )

  return (
    <div>


      {!user && 
        <div>
          <h1>log in to application</h1>
          <Notification message={noticeMessage} error={error} />
          {loginForm()}
        </div>
      }
      {user &&
        <div>
          <h1>blogs</h1>
          <Notification message={noticeMessage} error={error} />
          <p>{user.name} logged in</p>
          <h1>create new</h1>
          {blogForm()}
          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} />
          ))}

          <button onClick={handleLogout}>logout</button>
        </div>
      }
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [error, setError] = useState(false)
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

  const handleLogin = async (username, password) => {
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
    
      blogService.setToken(user.token)
      setUser(user)
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
  }

  const addBlog = async (newBlogObject) => {
    try {
      const returnedBlog = await blogService.create(newBlogObject)
      setBlogs(blogs.concat(returnedBlog))
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
 
  return (
    <div>

      {!user && 
        <div>
          <h1>log in to application</h1>
          <Notification message={noticeMessage} error={error} />
          <LoginForm handleLogin={handleLogin} />
        </div>
      }
      
      {user &&
        <div>
          <h1>blogs</h1>
          <Notification message={noticeMessage} error={error} />

          <p>{user.name} logged in</p>
          <h1>create new</h1>

          <BlogForm addBlog={addBlog} />

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
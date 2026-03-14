import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [error, setError] = useState(false)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

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
      const returnedBlog = await blogService.createBlog(newBlogObject)

      blogFormRef.current.toggleVisibility()

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

  const updateBlog = async (id, updatedBlogObject) => {
    try {
      const returnedBlog = await blogService.updateBlog(id, updatedBlogObject)
      setBlogs(blogs.map(blog => blog.id === id
        ? { ...returnedBlog, user: blog.user }
        : blog
      ))
    } catch (exception) {
      setNoticeMessage(`exception occurred while updating the blog: ${exception}`)
      setError(true)
      setTimeout(() => {
        setNoticeMessage(null)
        setError(false)
      }, 5000)
    }
  }

  const deleteBlog = async (id) => {
    if (!window.confirm(`Remove blog - ${blogs.find(b => b.id === id)?.title} by ${blogs.find(b => b.id === id)?.author}?`)) return
    try {
      await blogService.deleteBlog(id)
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (exception) {
      setNoticeMessage(`exception occurred while deleting the blog: ${exception}`)
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
          <Togglable buttonLabel="login">
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
        </div>
      }

      {user &&
        <div>
          <h1>BLOGS</h1>
          <Notification message={noticeMessage} error={error} />

          <p>
            {user.name} logged in
            <button style={{ marginLeft:4 }} onClick={handleLogout}>logout</button>
          </p>

          <Togglable buttonLabel="Creat new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          {blogs.sort((a, b) => b.likes - a.likes).map(blog => (
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} currentUser={user} />
          ))}
        </div>
      }
    </div>
  )
}

export default App
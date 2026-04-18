import { useState, useEffect } from 'react'

import {
  Routes, Route, Link, useMatch, Navigate
} from 'react-router-dom'

import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [noticeMessage, setNoticeMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs( blogs )
      )
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

  const padding = {
    padding: 5
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to="/">blogs</Link>
        {user && <Link style={padding} to="/create">new blog</Link>}
        {!user && <Link style={padding} to="/login">login</Link>}
        {user && <button style={{ marginLeft:4 }} onClick={handleLogout}>logout</button>}
      </div>
      <Notification message={noticeMessage} error={error} />
      <Routes>
        <Route path="/blogs/:id" element={
          <Blog
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
            currentUser={user} />
        } />
        <Route path="/" element={
          <BlogList blogs={blogs} />
        } />

        <Route path="/login" element={
          !user ? <LoginForm handleLogin={handleLogin} /> : <Navigate replace to="/" />
        } />

        <Route path="/create" element={
          user
            ? <BlogForm createBlog={addBlog} />
            : <Navigate replace to="/login" />
        } />
      </Routes>
    </div>
  )
}

export default App
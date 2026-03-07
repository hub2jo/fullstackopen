import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    addBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>title:
        <input name="title" value={newBlog.title} onChange={handleBlogChange} /><br />
      </label>
      <label>author:
        <input name="author" value={newBlog.author} onChange={handleBlogChange} /><br />
      </label>
      <label>url:
        <input name="url" value={newBlog.url} onChange={handleBlogChange} /><br />
      </label>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
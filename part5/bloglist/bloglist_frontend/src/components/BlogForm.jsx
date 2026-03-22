import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)
    setNewBlog({ title: '', author: '', url: '' })
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setNewBlog({ ...newBlog, [name]: value })
  }

  return (
    <div>
      <h1>create new</h1>
      <form onSubmit={addBlog}>
        <label>title:
          <input
            name="title"
            placeholder="write blog title here"
            value={newBlog.title}
            onChange={handleBlogChange}
          /><br />

        </label>
        <label>author:
          <input
            name="author"
            placeholder="write blog author here"
            value={newBlog.author}
            onChange={handleBlogChange}
          /><br />
        </label>
        <label>url:
          <input
            name="url"
            placeholder="write blog url here"
            value={newBlog.url}
            onChange={handleBlogChange}
          /><br />
        </label>
        <button type="submit">create</button>
      </form>
    </div>

  )
}

export default BlogForm
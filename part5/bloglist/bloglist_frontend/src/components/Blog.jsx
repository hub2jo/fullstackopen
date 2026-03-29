import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const [show, setShow] = useState(false)
  const toggleShow = () => setShow(!show)
  const hideWhenVisible = { display: show ? 'none' : '' }
  const showWhenVisible = { display: show ? '' : 'none' }

  const isOnwer = blog.user?.id?.toString() === currentUser?.id?.toString()
  console.log('blog.user.id:', blog.user?.id, 'currentUser.id:', currentUser?.id)

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div className="blog" style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button style={{ marginLeft:4 }} onClick={toggleShow}>view</button>
      </div>
      <div style={showWhenVisible}>
        <p style={{ margin:0 }}>
          {blog.title} {blog.author}
          <button style={{ marginLeft:4 }} onClick={toggleShow}>hide</button>
        </p>
        <p style={{ margin:0 }}>{blog.url}</p>
        <p style={{ margin:0 }}>
          {blog.likes} likes
          <button
            style={{ marginLeft:4 }}
            onClick={updateBlog.bind(null, blog.id, {
              title: blog.title,
              author: blog.author,
              url: blog.url,
              likes: blog.likes + 1,
            })}
          >
            like
          </button>
        </p>
        <p style={{ margin:0 }}>added by {blog.user?.name}</p>
        {isOnwer && (
          <button
            style={{ backgroundColor: 'blue', color: 'white' }}
            onClick={() => deleteBlog(blog.id)}>remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog

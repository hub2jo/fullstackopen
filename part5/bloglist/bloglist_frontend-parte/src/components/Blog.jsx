import { useParams, useNavigate } from 'react-router-dom'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const id = useParams().id
  const navigate = useNavigate()

  if(!blog) {
    return null
  }

  const isOnwer = blog.user?.id?.toString() === currentUser?.id?.toString()
  console.log('blog.user.id:', blog.user?.id, 'currentUser.id:', currentUser?.id)

  const handleDelete = () => {
    deleteBlog(id)
    navigate('/')
  }

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  if(!blog) {
    return null
  }

  return (
    <div className="blog" style={blogStyle}>

      <div>
        <p style={{ margin:0 }}>
          {blog.title} {blog.author}
        </p>
        <p style={{ margin:0 }}>{blog.url}</p>
        <p style={{ margin:0 }}>
          {blog.likes} likes
          {currentUser &&
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
          }
        </p>
        <p style={{ margin:0 }}>added by {blog.user?.name}</p>
        {isOnwer && (
          <button
            style={{ backgroundColor: 'blue', color: 'white' }}
            onClick={handleDelete}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog

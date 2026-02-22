const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'test',
    author: 'hub2jo test',
    url: 'test.com',
    likes: 0
  },
  {
    title: 'JavaScript is hard',
    author: 'hub2jo test',
    url: 'javascript.com',
    likes: 1
  },
  { 
    title: 'async/await simplifies making async calls',
    author: 'hub2jo test',
    url: 'asyncawait.com',
    likes: 2
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'hub2jo test', url: 'test.com', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
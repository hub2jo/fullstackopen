const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Import the Express app
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('blog api tests', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })

  // exercise 4.8 - HTTP GET method tests with correct number of blogs in JSON format
  test('HTTP GET - blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('HTTP GET - all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // exercise 4.9 - HTTP GET method tests with unique identifier property named id
  test('HTTP GET - all blogs have id property', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      assert.ok(blog.id)
    })
  })

  // exercise 4.10 - HTTP POST method tests with valid blog
  test('HTTP POST - a valid blog can be added', async () => {
    const newBlog = {
      title: 'Tesla is not as good as SpaceX',
      author: 'Elon Musk',
      url: 'https://www.tesla.com', 
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const title = blogsAtEnd.map(r => r.title)
    assert(title.includes('Tesla is not as good as SpaceX'))

    const author = blogsAtEnd.map(r => r.author)
    assert(author.includes('Elon Musk'))
  })

  // exercise 4.11 - default likes value to 0
  test('HTTP POST - blog without likes defaults to 0', async () => {
    const newBlog = {
      title: 'Tesla is not as good as SpaceX',
      author: 'Elon Musk',
      url: 'https://www.tesla.com', 
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const lastBlog = blogsAtEnd[blogsAtEnd.length - 1]
    assert.strictEqual(lastBlog.likes, 0)
  })

  // exercise 4.12 - missing title and url properties - required to refactor model to make them mandatory
  test('HTTP POST - blog without title and url is not added', async () => {
    const newBlog = {
      author: 'Elon Musk',
      likes: 100
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const authors = blogsAtEnd.map(r => r.author)
    assert(!authors.includes('Elon Musk'))
  })

  // exercise 4.13 - HTTP DELETE method tests
  test('HTTP DELETE - a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(r => r.title)
    assert(!titles.includes(blogToDelete.title))
  })

  // exercise 4.14 - HTTP PUT method tests
  test('HTTP PUT - a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      title: 'Updated Title',
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: 1000
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.title, 'Updated Title')
    assert.strictEqual(updatedBlog.likes, 1000)
  })
  
  after(async () => {
    await mongoose.connection.close()
  })

})
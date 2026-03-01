const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Import the Express app
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('blog api tests', () => {

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const users = await User.insertMany(await helper.createInitialUsers())
    
    const rootUser = users[0]
    const blogsWithUser = helper.initialBlogs.map(blog => ({ ...blog, user: rootUser._id }))
    
    const savedBlogs = await Blog.insertMany(blogsWithUser)

    rootUser.blogs = savedBlogs.map(blog => blog._id)
    await rootUser.save()
  })


  describe('GET /api/blogs - still works without token', () => {
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
    test('HTTP GET - all blogs have id property', async () => {
      const response = await api.get('/api/blogs')
      response.body.forEach(blog => {
        assert.ok(blog.id)
      })
    })
  })

  describe ('POST /api/blogs - requires token', () => {
    test('HTTP POST - fails with status code 401 if token is not provided', async () => {
      const newBlog = {
        title: 'Tesla is not as good as SpaceX',
        author: 'Elon Musk',
        url: 'https://www.tesla.com', 
        likes: 100
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.error, 'token missing')

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      const title = blogsAtEnd.map(r => r.title)
      assert(!title.includes('Tesla is not as good as SpaceX'))

      const author = blogsAtEnd.map(r => r.author)
      assert(!author.includes('Elon Musk'))

    })

    test('HTTP POST - succeeds with status code 201 if token is provided', async () => {
      // First, we need to log in to get a token
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'rudimentary' })
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const token = loginResponse.body.token

      const newBlog = {
        title: 'Tesla is not as good as SpaceX',
        author: 'Elon Musk',
        url: 'https://www.tesla.com', 
        likes: 100
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      const titles = blogsAtEnd.map(r => r.title)
      assert(titles.includes('Tesla is not as good as SpaceX'))

      const authors = blogsAtEnd.map(r => r.author)
      assert(authors.includes('Elon Musk'))
    })
  })

  describe('DELETE /api/blogs/:id - requires token', () => {
    test('HTTP DELETE - fails with status code 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const response = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.error, 'token missing')

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('HTTP DELETE - succeeds with status code 204 if token is provided', async () => {
      // First, we need to log in to get a token
      const loginResponse = await api
        .post('/api/login')
        .send({ username: 'root', password: 'rudimentary' })
        .expect(200)

      const token = loginResponse.body.token

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
      const ids = blogsAtEnd.map(r => r.id)
      assert(!ids.includes(blogToDelete.id))  
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
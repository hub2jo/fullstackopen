const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app') // Import the Express app
const helper = require('./test_helper')
// const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('user api tests', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(await helper.createInitialUsers())
  })

  // Exercise 4.16: username and password testing
  describe('creating a new user', () => {
    test('user creation with username shorter than 3 characters fails with status code 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'ab',
        name: 'short username',
        password: 'validpassword'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('username must be at least 3 characters long'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation with password shorter than 3 characters fails with status code 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'validusername',
        name: 'valid name',
        password: 'ab'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password must be at least 3 characters long'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })  

    test('user creation with duplicate username fails with status code 400', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'duplicate username',
        password: 'validpassword'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('username must be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('user creation with valid data succeeds', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'validusername',
        name: 'valid name',
        password: 'validpassword'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))  

    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
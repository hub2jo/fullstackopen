const mongoose = require('mongoose')

// Define the schema for a blog post
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// Create the model from the schema
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
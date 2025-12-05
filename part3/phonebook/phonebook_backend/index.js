require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const Person = require('./models/person')
const app = express()

morgan.token('data', (request) => {
    return request.method === 'POST' 
      ? JSON.stringify(request.body) 
      : '';
});
  
app.use(morgan(':method :url :status content-length :res[content-length] - :response-time ms :data'));

/*
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
*/

app.use(express.json()) // middleware to parse JSON bodies
app.use(express.static('dist')) // serve static files from the 'dist' directory

app.get('/info', (request, response) => {
  const date = new Date()
  Person.find({}).then(persons => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
  })   
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

/*
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.statusMessage = `resource (person) with id (${request.params.id}) not found` // custom status message for debugging
    response.status(404).end()
  }
})
*/

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'bad id' })
    })
})

// not yet refactered delete to use mongoose
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  person = persons.find(person => person.id === id)

  if (!person) {
    response.statusMessage = `resource (person) with id (${request.params.id}) not found` // custom status message for debugging
    return response.status(404).end()
  }
    
  persons = persons.filter(person => person.id !== id)
  response.statusMessage = `resource (person) with id (${request.params.id}) deleted successfully` // custom status message for debugging
  response.status(204).end()
})

/*
// get highesst current id
const currentMaxId = persons.length > 0
  ? Math.max(...persons.map(n => Number(n.id)))
  : 0

const allowedMaxId = 10000

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min) + 1;
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({  
      error: 'incomplete details: name or number is missing' 
    })
  } else if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({  
      error: 'name already exist: name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: getRandomInt(currentMaxId, allowedMaxId).toString(),
  }

  persons = persons.concat(person)

  response.json(person)
})
*/

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({  
      error: 'incomplete details: name or number is missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

// handler of requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
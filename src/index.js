const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(u => u.username === username)
  if (!user) {
    return response.status(404).json({
      "error": "Not authorized"
    })
  }

  request.body.user = user
  return next()
}

app.post('/users', (request, response) => {
  const { name, username } = request.body

  if (users.some(u => u.username === username)) {
    return response.status(400).json({
      "error": "Username unavailable"
    })
  }

  const newuser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  users.push(newuser)

  return response.status(201).json(newuser)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { todos } = request.body.user
  return response.json([...todos])
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline, user } = request.body

  const newtodo = {
    id: uuidv4(),
    title: title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }
  user.todos.push(newtodo)

  return response.status(201).json({ ...newtodo })
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline, user } = request.body
  const { id } = request.params

  const todo = user.todos.find(t => t.id === id)
  if (!todo) {
    return response.status(404).json({ "error": "Invalid ToDo Id" })
  }
  todo.title = title
  todo.deadline = new Date(deadline)

  return response.send()
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;
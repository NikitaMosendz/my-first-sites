const express = require('express');
const cors = require('cors');

let app = express();

app.use(express.json());
app.use(cors());

const siteSettings = {
    status: "Server is running smoothly",
    recommendedColor: "#ffd39d"
}

let todos = [
    { id: 1, title: "Buy new keyboard", completed: true },
    { id: 2, title: "Buy new monitor", completed: false },
    { id: 3, title: "Buy new headphones", completed: false }
];

app.get('/todos', (req, res) => {
    res.json(todos)
});
app.get('/color', (req, res) => {
    res.json(siteSettings)
});
app.get('/status', (req, res) => {
    res.json(siteSettings)
});

app.post('/todos', (req, res) => {
    const newTodo = {
        id: todos.length + 1,
        title: req.body.title,
        completed: false
    };

    todos.push(newTodo);
    res.json(newTodo);
})

app.patch('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);

    const currentTodo = todos.find(t => t.id === todoId);

    if (currentTodo) {
        currentTodo.completed = req.body.completed;
        res.json(currentTodo);
    } else {
        res.status(404).json({ error: "Task not found"});
    };
});

app.listen(4000, () => {
    console.log('Server started on http://localhost:4000')
});
const express = require('express');
const cors = require('cors');

let app = express();

app.use(express.json());
app.use(cors());

let todos = [
    { id: 1, title: "Buy new keyboard", completed: true },
    { id: 2, title: "Buy new monitor", completed: false },
    { id: 3, title: "Buy new headphones", completed: false }
];

const todoSettings = {
    status: "Server is running smoothly",
    recommendedColor: "#ffd39d"
}


app.get('/todos', (req, res) => {
    res.json(todos);
});
app.get('/color', (req, res) => {
    res.json(todoSettings);
});
app.get('/status', (req, res) => {
    res.json(todoSettings);
});
app.get('/todos/status', (req, res) => {  
    const todoStats = {
        total: todos.length,
        completedCount: todos.filter(t => t.completed).length,
        pendingCount: todos.filter(t => !t.completed).length
    }
    res.json(todoStats);
});
app.get('/todos/search', (req, res) => {
    const { title } = req.query;
    const filteredTodosList = todos.filter(todo => todo.title.toLowerCase().includes(title.toLowerCase()));
    res.json(filteredTodosList);
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

app.delete('/todos/clear', (req, res) => {
    todos = [];
    res.json({ success: true })
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
app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);

    todos = todos.filter(t => t.id !== todoId);

    res.json({ success: true, deletedId: todoId });
});

app.listen(4000, () => {
    console.log('Server started on http://localhost:4000')
});
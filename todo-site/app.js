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

app.get('/todos', (req, res) => {
    res.json(todos)
});

app.listen(4000, () => {
    console.log('Server started on http://localhost:4000')
});
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

app.listen(4000, () => {
    console.log('Server started on http://localhost:4000')
});
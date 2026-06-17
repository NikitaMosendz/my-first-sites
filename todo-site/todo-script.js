const serverButton = document.getElementById('server-button');
const statusTextField = document.getElementById('status-text-field');
const textField = document.getElementById('text-field');
const todoList = document.getElementById('todo-list');
const body = document.body;

serverButton.addEventListener('click', () => {
    fetch('http://localhost:4000/status')
        .then(response => response.json())
        .then(data => {
            statusTextField.textContent = data.status;
    });
});

fetch('http://localhost:4000/color')
    .then(response => response.json())
    .then(data => {
        body.style.backgroundColor = data.recommendedColor
    });

fetch('http://localhost:4000/todos')
    .then(response => response.json())
    .then(data => {
        todoList.innerHTML = '';

        data.forEach(todo => {
            todoList.appendChild(document.createElement("li")).textContent = todo.title
        });
    });
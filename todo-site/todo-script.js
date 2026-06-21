const taskCounter = document.getElementById('counter');
const serverButton = document.getElementById('server-button');
const addButton = document.getElementById('add-button');
const deleteAllButton = document.getElementById('delete-all-button');
const statusTextField = document.getElementById('status-text-field');
const inputErrorField = document.getElementById('input-error');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const body = document.body;

todoInput.addEventListener('input', (event) => {
    todoInput.style.borderColor = "rgb(59, 59, 59)";
    inputErrorField.textContent = '';
});

addButton.addEventListener('click', () => {
    const taskText = todoInput.value;

    if (taskText === '') {
        todoInput.style.borderColor = 'red';
        inputErrorField.textContent = "Task cannot be empty!";
        return;
    };

    fetch('http://localhost:4000/todos', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ title: taskText })
    })
    .then(response => response.json())
    .then(newTodo => {
        console.log("Successfully added:", newTodo);

        loadTodos();

        todoInput.value = '';
    })
});

deleteAllButton.addEventListener('click', () => {
    fetch('http://localhost:4000/todos/clear', {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadTodos();
        }
    })
});

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
        body.style.backgroundColor = data.recommendedColor;
    });

function loadTodos() {
    fetch('http://localhost:4000/todos')
        .then(response => response.json())
        .then(data => {
            todoList.innerHTML = '';

            data.forEach(todo => {
                const li = document.createElement("li");
                
                const textSpan = document.createElement("span");
                textSpan.textContent = todo.title;
                if (todo.completed) {
                    textSpan.style.textDecoration = "line-through";
                }

                textSpan.addEventListener('click', () => {
                    const updatedStatus = !todo.completed;
                    fetch(`http://localhost:4000/todos/${todo.id}`, {
                        method: 'PATCH',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({ completed: updatedStatus })
                    })
                    .then(response => response.json())
                    .then(() => {
                        loadTodos();
                    });
                });

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = " X";
                deleteBtn.style.background = "none";
                deleteBtn.style.border = "none";
                deleteBtn.style.cursor = "pointer";
                deleteBtn.style.color = "red";

                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();

                    fetch(`http://localhost:4000/todos/${todo.id}`, {
                        method: 'DELETE'
                    })
                    .then(() => loadTodos());
                })

                li.appendChild(textSpan);
                li.appendChild(deleteBtn);
                todoList.appendChild(li);
            });

            taskCounter.textContent = `Total tasks: ${data.length}`;
        });
}

loadTodos();
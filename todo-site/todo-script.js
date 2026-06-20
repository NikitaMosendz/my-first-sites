const serverButton = document.getElementById('server-button');
const addButton = document.getElementById('add-button');
const statusTextField = document.getElementById('status-text-field');
const textInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const body = document.body;

serverButton.addEventListener('click', () => {
    fetch('http://localhost:4000/status')
        .then(response => response.json())
        .then(data => {
            statusTextField.textContent = data.status;
    });
});

addButton.addEventListener('click', () => {
    const taskText = textInput.value;

    if (taskText === '') return;

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

        textInput.value = '';
    })
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
        });
}

loadTodos();
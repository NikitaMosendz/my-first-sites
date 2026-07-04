const taskCounter = document.getElementById('counter');
const completedTasks = document.getElementById('completed-counter');
const pendingTasks = document.getElementById('pending-counter');

const serverButton = document.getElementById('server-button');
const statusTextField = document.getElementById('status-text-field');

const addButton = document.getElementById('add-button');
const deleteAllButton = document.getElementById('delete-all-button');

const todoInput = document.getElementById('todo-input');
const inputErrorField = document.getElementById('input-error');

const searchInput = document.getElementById('search-input');
const todoList = document.getElementById('todo-list');

const filterAllButton = document.getElementById('filter-all');
const filterActiveButton = document.getElementById('filter-active');
const filterCompletedButton = document.getElementById('filter-completed');

const body = document.body;

let currentTodos = [];

let pressedAllTodos = true;
let pressedActiveTodos = false;
let pressedCompletedTodos = false;

filterAllButton.addEventListener('click', () => {
    pressedAllTodos = true;
    pressedActiveTodos = false;
    pressedCompletedTodos = false;

    filterAllButton.classList.add('active');
    filterActiveButton.classList.remove('active');
    filterCompletedButton.classList.remove('active');

    renderTodos(currentTodos);

    if (searchInput.value.trim() !== '') {
        searchInput.dispatchEvent(new Event('input'));
    } else {
        loadTodos();
    }
})

filterActiveButton.addEventListener('click', () => {
    pressedAllTodos = false;
    pressedActiveTodos = true;
    pressedCompletedTodos = false;

    filterAllButton.classList.remove('active');
    filterActiveButton.classList.add('active');
    filterCompletedButton.classList.remove('active');
    
    const activeTodos = currentTodos.filter(todo => !todo.completed);
    renderTodos(activeTodos);

    if (searchInput.value.trim() !== '') {
        searchInput.dispatchEvent(new Event('input'));
    } else {
        loadTodos();
    }
})

filterCompletedButton.addEventListener('click', () => {
    pressedAllTodos = false;
    pressedActiveTodos = false;
    pressedCompletedTodos = true;

    filterAllButton.classList.remove('active');
    filterActiveButton.classList.remove('active');
    filterCompletedButton.classList.add('active');

    const completedTodos = currentTodos.filter(todo => todo.completed);
    renderTodos(completedTodos);

    if (searchInput.value.trim() !== '') {
        searchInput.dispatchEvent(new Event('input'));
    } else {
        loadTodos();
    }
})

todoInput.addEventListener('input', (event) => {
    todoInput.style.borderColor = "rgb(59, 59, 59)";
    inputErrorField.textContent = '';
});

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query === '') {
        loadTodos();
        return;
    }

    fetch(`http://localhost:4000/todos/search?title=${query}`)
        .then(response => response.json())
        .then(filteredTodos => {
            if (pressedAllTodos) {
                renderTodos(filteredTodos);
            } else if (pressedActiveTodos) {
                renderTodos(filteredTodos.filter(todo => !todo.completed));
            } else if (pressedCompletedTodos) {
                renderTodos(filteredTodos.filter(todo => todo.completed));
            }
        });
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

        currentTodos.push(newTodo);

        if (searchInput.value.trim() !== '') {
            searchInput.dispatchEvent(new Event('input'));
        } else {
            loadTodos();
        }

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

function renderTodos(todosArray) {
    todoList.innerHTML = '';

    todosArray.forEach(todo => {
        const li = document.createElement("li");
        
        const textSpan = document.createElement("span");
        textSpan.textContent = todo.title;
        if (todo.completed) {
            textSpan.style.textDecoration = "line-through";
        }

        textSpan.addEventListener('click', (e) => {
            e.preventDefault();
            
            const updatedStatus = !todo.completed;

            fetch(`http://localhost:4000/todos/${todo.id}`, {
                method: 'PATCH',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ completed: updatedStatus })
            })
            .then(response => response.json())
            .then(updatedTodo => {
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
            .then(() => {
                if (searchInput.value.trim() !== '') {
                    searchInput.dispatchEvent(new Event('input'));
                } else {
                    loadTodos();
                }
            });
        })

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    });
}

function loadTodos() {
    fetch('http://localhost:4000/todos')
        .then(response => response.json())
        .then(data => {
            currentTodos = data;

            let filtered = currentTodos;
            if (pressedActiveTodos) {
                filtered = currentTodos.filter(todo => !todo.completed);
            } else if (pressedCompletedTodos) {
                filtered = currentTodos.filter(todo => todo.completed);
            }

            const query = searchInput.value.trim().toLowerCase();
            if (query !== '') {
                filtered = filtered.filter(todo => todo.title.toLowerCase().includes(query));
            }

            renderTodos(filtered);
        });
    updateStatus();
};

function updateStatus() {
    fetch('http://localhost:4000/todos/status')
        .then(response => response.json())
        .then(data => {
            taskCounter.textContent = `Total Tasks: ${data.total}`;
            completedTasks.textContent = `Completed Tasks: ${data.completedCount}`;
            pendingTasks.textContent = `Pending Tasks: ${data.pendingCount}`;
        });
}

loadTodos();
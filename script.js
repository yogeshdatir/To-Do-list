// Todo class: Represents a todo task

class Todo {
    constructor(task, prio, isDone) {
        this.task = task;
        this.prio = prio;
        this.isDone = isDone;
    }
}

// Store class: Handles storage

class Store {
// We will use localStorage to store the todo list. But localStorage can only store string, so we will stringify array of todo task objects and parse it while fetching them.

    static getTodos() {
        let todos
        if(localStorage.getItem('todos') === null) {
            todos = []
        } else {
            todos = JSON.parse(localStorage.getItem('todos'))
        }
        return todos
    }

    static addTodo(todo) {
        const todos = Store.getTodos()
        todos.push(todo)
        localStorage.setItem('todos', JSON.stringify(todos))
    }

    static removeTodo(elementClicked) {
        if(elementClicked.parentElement.classList.contains('close')) {
            const row = elementClicked.parentElement.parentElement.parentElement.parentElement

            const task = row.children[1].children[0].innerHTML

            const todos = Store.getTodos()

            todos.forEach((todo, i) => {
                if(todo.task === task) {
                    todos.splice(i, 1)
                }
            })

            localStorage.setItem('todos', JSON.stringify(todos))
        }
    }
}

// UI class: Handles UI Tasks

class UI {
    static displayTodo() {
        const StoredTodos = Store.getTodos()

        const todos = StoredTodos

        todos.forEach( todo => UI.addTodoToList(todo))
    }

    static addTodoToList(todo) {
        const list = document.querySelector('#todo-list')

        const row = document.createElement('tr')

        const isChecked = todo.isDone ? 'checked' : '' 

        row.innerHTML = `
        <td>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="blankCheckbox" value="option1" ${isChecked}>
            </div>
        </td>
        <td>
            <div>${todo.task}</div>
        </td>
        <td>
            <div>${todo.prio}</div>
        </td>
        <td>
            <a href="#">
                <button type="button" class="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </a>
        </td>
        `

        list.appendChild(row)
    }

    static clearFields() {
        document.querySelector('#task').value = ''
        document.querySelector('#prio').value = ''        
    }

    static deleteTodo(elementClicked) {
        if(elementClicked.parentElement.classList.contains('close')) {
            elementClicked.parentElement.parentElement.parentElement.parentElement.remove()
        }
    }
}

// Event: Display todos
document.addEventListener('DOMContentLoaded', UI.displayTodo())

// Event: Add todo to the list
document.addEventListener('submit', e => {
    // Prevent actual submit
    e.preventDefault()

    // get todo values
    const task = document.querySelector('#task').value
    const prio = document.querySelector('#prio').value
    const isDone = false

    // Validate todo
    if(task === '') {
        alert('Add task...')
    } else {
        // Instantiate a todo task
        const todo = new Todo(task, prio, isDone)

        // Add todo to UI
        UI.addTodoToList(todo)

        // Add todo to Store
        Store.addTodo(todo)

        // Clear fields
        UI.clearFields()
    }
})

// Event: Remove todo from the list
document.querySelector('#todo-list').addEventListener('click', e => {
    // Prevent actual submit
    e.preventDefault()

    // Remove todo from UI
    UI.deleteTodo(e.target)

    // Remove todo from Store
    Store.removeTodo(e.target)
})
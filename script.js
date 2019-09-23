// Todo class: Represents a todo task

class Todo {
    constructor(id, task, prio, isDone) {
        this.id = id;
        this.task = task;
        this.prio = prio;
        this.isDone = isDone;
    }
}

// Store class: Handles storage

// variable to store unique auincrementing ID
var globalID = 0

class Store {
// We will use localStorage to store the todo list. But localStorage can only store string, so we will stringify array of todo task objects and parse it while fetching them.

    static getTodos() {
        let todos
        if(localStorage.getItem('todos') === null) {
            todos = []
        } else {
            // array which is stored as string in localStorage needs to parsed into JSON format
            todos = JSON.parse(localStorage.getItem('todos'))
        }
        return todos
    }

    static addTodo(todo) {
        const todos = Store.getTodos()
        todos.push(todo)
        localStorage.setItem('todos', JSON.stringify(todos))

        // to stop restart of globalID counter
        if(localStorage.getItem('globalID'))
            globalID = localStorage.getItem('globalID')

        globalID++
        localStorage.setItem('globalID', globalID)
    }

    static removeTodo(elementClicked) {
        if(elementClicked.parentElement.classList.contains('close')) {
            // Used data attribute to get required data
            const id = elementClicked.getAttribute('data-id')

            const todos = Store.getTodos()

            todos.forEach((todo, i) => {
                if (todo.id === id) {
                    todos.splice(i, 1)
                }
            })

            localStorage.setItem('todos', JSON.stringify(todos))
        }
    }

    static completeTodo(elementClicked) {
        const id = elementClicked.getAttribute('data-id')

        const todos = Store.getTodos()

        todos.forEach((todo, i) => {
            if (todo.id === id) {
                todo.isDone = !todo.isDone
                if (todo.isDone) {
                    document.querySelector(`#task-${todo.id}`).classList.add('completed-todo')
                    document.querySelector(`#prio-${todo.id}`).classList.add('completed-todo')
                } else {
                    document.querySelector(`#task-${todo.id}`).classList.remove('completed-todo')
                    document.querySelector(`#prio-${todo.id}`).classList.remove('completed-todo')
                }
            }
        })

        localStorage.setItem('todos', JSON.stringify(todos))

    }
}

// UI class: Handles UI Tasks

class UI {
    static displayTodo() {
        const StoredTodos = Store.getTodos()

        const todos = StoredTodos

        todos.forEach(todo => UI.addTodoToList(todo))
    }

    static addTodoToList(todo) {
        const list = document.querySelector('#todo-list')

        const row = document.createElement('tr')

        row.setAttribute('id', `${todo.id}`)

        const isChecked = todo.isDone ? 'checked' : ''

        row.innerHTML = `
        <td class="col-done-width" id="check-${todo.id}">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="task-checkbox-${todo.id}" ${isChecked} data-id="${todo.id}">
            </div>
        </td>
        <td class="col-task" id="task-${todo.id}">
            <div>${todo.task}</div>
        </td>
        <td id="prio-${todo.id}">
            <div>${todo.prio}</div>
        </td>
        <td class="col-done-width" id="close-${todo.id}">
            <a href="#">
                <button type="button" class="close" aria-label="Close">
                    <span aria-hidden="true" data-id="${todo.id}">&times;</span>
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
    if (task === '') {
        alert('Add task...')
    } else {

        const id = localStorage.getItem('globalID')

        // Instantiate a todo task
        const todo = new Todo(id, task, prio, isDone)

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

    // Need normal checkbox behaviour untouched
    if (e.target.type != 'checkbox') {

        // Prevent actual submit
        e.preventDefault()

        // Remove todo from UI
        UI.deleteTodo(e.target)

        // Remove todo from Store
        Store.removeTodo(e.target)
    } else {
        Store.completeTodo(e.target)
    }
})
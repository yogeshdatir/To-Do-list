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
if (!localStorage.getItem('globalID'))
    localStorage.setItem('globalID', globalID)

class Store {
    // We will use localStorage to store the todo list. But localStorage can only store string, so we will stringify array of todo task objects and parse it while fetching them.

    static getTodos() {
        let todos
        if (localStorage.getItem('todos') === null) {
            todos = []
        } else {
            // array which is stored as string in localStorage needs to parsed into JSON format
            todos = JSON.parse(localStorage.getItem('todos'))
        }
        return todos
    }

    static getTodoWithId(id) {
        let todos = JSON.parse(localStorage.getItem('todos'))
        let found
        todos.forEach(todo => {
            if (todo.id == id) {
                found = todo
            }
        })
        return found
    }

    static addTodo(todo) {
        const todos = Store.getTodos()
        todos.push(todo)
        localStorage.setItem('todos', JSON.stringify(todos))

        // to stop restart of globalID counter
        if (localStorage.getItem('globalID'))
            globalID = localStorage.getItem('globalID')

        globalID++
        localStorage.setItem('globalID', globalID)
    }

    static removeTodo(elementClicked) {
        if (elementClicked.classList.contains('close-button') || elementClicked.parentElement.classList.contains('close-button')) {
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

    static saveEdit(elementClicked) {
        if (elementClicked.classList.contains('save-button') || elementClicked.parentElement.classList.contains('save-button')) {
            const id = elementClicked.getAttribute('data-id')

            const todos = Store.getTodos()

            const editedTask = document.querySelector('#task-input-' + id).value
            const editedPrio = document.querySelector('#prio-input-' + id).value

            todos.forEach((todo, i) => {
                if (todo.id === id) {
                    todo.task = editedTask
                    todo.prio = editedPrio
                }
            })

            localStorage.setItem('todos', JSON.stringify(todos))

            document.querySelector('#task-input-' + id).parentNode.removeChild(document.querySelector('#task-input-' + id))
            document.querySelector('#prio-input-' + id).parentNode.removeChild(document.querySelector('#prio-input-' + id))

            document.querySelector('#task-div-' + id).innerText = editedTask
            document.querySelector('#task-div-' + id).style.display = 'block'
            document.querySelector('#prio-div-' + id).innerText = editedPrio
            document.querySelector('#prio-div-' + id).style.display = 'block'

            document.querySelector('button.edit-button[data-id="' + id + '"]').style.display = 'block'
            document.querySelector('button.close-button[data-id="' + id + '"]').style.display = 'block'

            document.querySelector('button.save-button[data-id="' + id + '"]').style.display = 'none'
            document.querySelector('button.cancel-button[data-id="' + id + '"]').style.display = 'none'
        }
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

        row.setAttribute('id', `tr-${todo.id}`)

        const isChecked = todo.isDone ? 'checked' : ''
        const classForCompletedTasks = todo.isDone ? ' completed-todo' : ''

        row.innerHTML = `
        <td class="col-done-width" id="check-${todo.id}">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="task-checkbox-${todo.id}" ${isChecked} data-id="${todo.id}">
            </div>
        </td>
        <td class="col-task${classForCompletedTasks}" id="task-${todo.id}">
            <div id="task-div-${todo.id}">${todo.task}</div>
        </td>
        <td id="prio-${todo.id}" class=${classForCompletedTasks}>
            <div id="prio-div-${todo.id}">${todo.prio}</div>
        </td>
        <td class="col-done-width" id="close-${todo.id}">
            <div class="btn-group pull-right" id="btn-group-${todo.id}">
                <button type="button" class="edit-button" aria-label="Edit" data-id="${todo.id}">
                    <i class="fa fa-pencil" aria-hidden="true" data-id="${todo.id}"></i>
                </button>
                <button type="button" class="close-button" aria-label="Close" data-id="${todo.id}">
                    <i class="fa fa-trash" aria-hidden="true" data-id="${todo.id}"></i>
                </button>
                <button type="button" class="save-button" aria-label="Save" data-id="${todo.id}" style="display:none;">
                    <i class="fa fa-check" aria-hidden="true" data-id="${todo.id}"></i>
                </button>
                <button type="button" class="cancel-button" aria-label="Cancel" data-id="${todo.id}" style="display:none;">
                    <i class="fa fa-times" aria-hidden="true" data-id="${todo.id}"></i>
                </button>
            </div>
        </td>
        `

        list.appendChild(row)
    }

    static clearFields() {
        document.querySelector('#task').value = ''
        document.querySelector('#prio').value = ''
    }

    static deleteTodo(elementClicked) {
        if (elementClicked.classList.contains('close-button') || elementClicked.parentElement.classList.contains('close-button')) {
            // Used data attribute to get required data
            const id = elementClicked.getAttribute('data-id')

            document.querySelector('#tr-' + id).parentNode.removeChild(document.querySelector('#tr-' + id))
        }
    }

    static editTodo(elementClicked) {
        if (elementClicked.classList.contains('edit-button') || elementClicked.parentElement.classList.contains('edit-button')) {
            // Used data attribute to get required data
            const id = elementClicked.getAttribute('data-id')

            let todoEdit = Store.getTodoWithId(id)

            document.querySelector('#task-div-' + id).style.display = 'none'

            const taskInput = document.createElement('input')
            taskInput.type = 'text'
            taskInput.className = 'form-control'
            taskInput.id = 'task-input-' + id
            taskInput.value = todoEdit.task
            taskInput.autofocus = true
            document.querySelector('#task-' + id).appendChild(taskInput)

            document.querySelector('#prio-div-' + id).style.display = 'none'

            const prioInput = document.createElement('input')
            prioInput.type = 'text'
            prioInput.className = 'form-control'
            prioInput.id = 'prio-input-' + id
            prioInput.value = todoEdit.prio
            document.querySelector('#prio-' + id).appendChild(prioInput)

            document.querySelector('button.edit-button[data-id="' + id + '"]').style.display = 'none'
            document.querySelector('button.close-button[data-id="' + id + '"]').style.display = 'none'

            document.querySelector('button.save-button[data-id="' + id + '"]').style.display = 'block'
            document.querySelector('button.cancel-button[data-id="' + id + '"]').style.display = 'block'

        }
    }

    static cancelEdit(elementClicked) {
        if (elementClicked.classList.contains('cancel-button') || elementClicked.parentElement.classList.contains('cancel-button')) {
            // Used data attribute to get required data
            const id = elementClicked.getAttribute('data-id')
            document.querySelector('#task-input-' + id).parentNode.removeChild(document.querySelector('#task-input-' + id))
            document.querySelector('#prio-input-' + id).parentNode.removeChild(document.querySelector('#prio-input-' + id))

            document.querySelector('#task-div-' + id).style.display = 'block'
            document.querySelector('#prio-div-' + id).style.display = 'block'

            document.querySelector('button.edit-button[data-id="' + id + '"]').style.display = 'block'
            document.querySelector('button.close-button[data-id="' + id + '"]').style.display = 'block'

            document.querySelector('button.save-button[data-id="' + id + '"]').style.display = 'none'
            document.querySelector('button.cancel-button[data-id="' + id + '"]').style.display = 'none'
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

        // Edit todo
        UI.editTodo(e.target)

        // Save edited todo
        Store.saveEdit(e.target)

        // Cancel edit
        UI.cancelEdit(e.target)
        
    } else {
        Store.completeTodo(e.target)
    }
})
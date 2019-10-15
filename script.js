// Todo class: Represents a todo task

class Todo {
    constructor(id, task, prio, isDone, isUrgent, isImportant) {
        this.id = id;
        this.task = task;
        this.prio = prio;
        this.isDone = isDone;
        this.isUrgent = isUrgent;
        this.isImportant = isImportant;
    }
}

// Store class: Handles storage

// variable to store unique auincrementing ID
var globalID = 0
if (!localStorage.getItem('globalID'))
    localStorage.setItem('globalID', globalID)

var prioSort = ''
var taskSort = ''

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

        document.querySelector('#alert-box-message').textContent = "Task Added!"
        document.querySelector('.alert-box').classList.remove('alert-box-disappear')
        window.setTimeout(() => document.querySelector('.alert-box').classList.add('alert-box-disappear'), 5000)
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

            document.querySelector('#alert-box-message').textContent = "Task Removed!"
            document.querySelector('.alert-box').classList.remove('alert-box-disappear')
            window.setTimeout(() => document.querySelector('.alert-box').classList.add('alert-box-disappear'), 5000)
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

            document.querySelector('#alert-box-message').textContent = "Task Updated!"
            document.querySelector('.alert-box').classList.remove('alert-box-disappear')
            window.setTimeout(() => document.querySelector('.alert-box').classList.add('alert-box-disappear'), 5000)
        }
    }

    static sortTasks(elementClicked) {
        if (elementClicked.tagName === 'TH' && elementClicked.classList.contains('col-prio-width')) {
            document.querySelector('#task-sort-icon').classList = 'fa fa-sort'
            prioSort = (prioSort === 'asc' ? 'desc' : 'asc')
            let sortedTodos = Array.from(Store.getTodos()).sort((a, b) => prioSort === 'asc' ? a.prio - b.prio : b.prio - a.prio)
            localStorage.setItem('todos', JSON.stringify(sortedTodos))
            document.querySelector("#todo-list tbody").innerHTML = ''
            UI.displayTodo()
            if (prioSort === 'asc')
                document.querySelector('#prio-sort-icon').classList = 'fa fa-sort-down'
            else if (prioSort === 'desc')
                document.querySelector('#prio-sort-icon').classList = 'fa fa-sort-up'
        } else if (elementClicked.tagName === 'TH' && elementClicked.classList.contains('col-task')) {
            document.querySelector('#prio-sort-icon').classList = 'fa fa-sort'
            taskSort = (taskSort === 'asc' ? 'desc' : 'asc')
            let sortedTodos = Array.from(Store.getTodos()).sort(
                (a, b) => {
                    // Use toUpperCase() to ignore character casing
                    let taska = a.task.toUpperCase()
                    let taskb = b.task.toUpperCase()

                    let comparison = 0
                    if (taska > taskb) {
                        comparison = taskSort === 'asc' ? 1 : -1
                    } else if (taska < taskb) {
                        comparison = taskSort === 'asc' ? -1 : 1
                    }
                    return comparison
                }
            )
            localStorage.setItem('todos', JSON.stringify(sortedTodos))
            document.querySelector("#todo-list tbody").innerHTML = ''
            UI.displayTodo()
            if (taskSort === 'asc')
                document.querySelector('#task-sort-icon').classList = 'fa fa-sort-down'
            else if (taskSort === 'desc')
                document.querySelector('#task-sort-icon').classList = 'fa fa-sort-up'
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
        const list = document.querySelector('#todo-list tbody')

        const row = document.createElement('tr')

        row.setAttribute('id', `tr-${todo.id}`)

        const isChecked = todo.isDone ? 'checked' : ''
        const classForCompletedTasks = todo.isDone ? ' completed-todo' : ''

        const classForMatrix = todo.isUrgent ? todo.isImportant ? 'ui-color' : 'uni-color' : todo.isImportant ? 'nui-color' : 'nuni-color'

        row.innerHTML = `
        <td class="col-done-width" id="check-${todo.id}">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="task-checkbox-${todo.id}" ${isChecked} data-id="${todo.id}">
            </div>
        </td>
        <td class="col-task${classForCompletedTasks}" id="task-${todo.id}">
            <div id="task-div-${todo.id}">${todo.task}</div>
        </td>
        <td id="prio-${todo.id}" style="text-align:center;" class=${classForCompletedTasks}>
            <div id="prio-div-${todo.id}">${todo.prio}</div>
        </td>
        <td id="matrix-circle" class=${classForMatrix}><i class="fa fa-circle" aria-hidden="true"></i></td>
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
        document.querySelector('#urgent').checked = false
        document.querySelector('#important').checked = false
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

class Filter {
    uiToggle = 0
    nuiToggle = 0
    uniToggle = 0
    nuniToggle = 0

    static removeAllFilters() {
        let allMatrixBoxesSelector = 'td.ui-color, td.nui-color, td.uni-color, td.nuni-color'
        let rowsToDisplay = document.querySelectorAll(allMatrixBoxesSelector)
        rowsToDisplay.forEach(row => row.parentElement.style.display = 'table-row')
    }

    static filterList(selectorToHide, selectorToShow) {
        let rowsToRemove = document.querySelectorAll(selectorToHide)
        rowsToRemove.forEach(row => row.parentElement.style.display = 'none')
        let rowsToDisplay = document.querySelectorAll(selectorToShow)
        rowsToDisplay.forEach(row => row.parentElement.style.display = 'table-row')
    }

    static byMatrix(elementClicked) {

        if (elementClicked.id === 'ui' || elementClicked.parentElement.id === 'ui' || elementClicked.parentElement.parentElement.id === 'ui') {
            this.uiToggle = this.uiToggle ? 0 : 1
            if (this.uiToggle) {
                let nonUiTasksSelector = 'td.nui-color, td.uni-color, td.nuni-color'
                let uiTasksSelector = 'td.ui-color'
                this.filterList(nonUiTasksSelector, uiTasksSelector)
            } else {
                this.removeAllFilters()
            }
        } else if (elementClicked.id === 'nui' || elementClicked.parentElement.id === 'nui' || elementClicked.parentElement.parentElement.id === 'nui') {
            this.nuiToggle = this.nuiToggle ? 0 : 1
            if (this.nuiToggle) {
                let nonNuiTasksSelector = 'td.ui-color, td.uni-color, td.nuni-color'
                let nuiTasksSelector = 'td.nui-color'
                this.filterList(nonNuiTasksSelector, nuiTasksSelector)
            } else {
                this.removeAllFilters()
            }
        } else if (elementClicked.id === 'uni' || elementClicked.parentElement.id === 'uni' || elementClicked.parentElement.parentElement.id === 'uni') {
            this.uniToggle = this.uniToggle ? 0 : 1
            if (this.uniToggle) {
                let nonUniTasksSelector = 'td.ui-color, td.nui-color, td.nuni-color'
                let uniTasksSelector = 'td.uni-color'
                this.filterList(nonUniTasksSelector, uniTasksSelector)
            } else {
                this.removeAllFilters()
            }
        } else if (elementClicked.id === 'nuni' || elementClicked.parentElement.id === 'nuni' || elementClicked.parentElement.parentElement.id === 'nuni') {
            this.nuniToggle = this.nuniToggle ? 0 : 1
            if (this.nuniToggle) {
                let nonNuniTasksSelector = 'td.ui-color, td.uni-color, td.nui-color'
                let nuniTasksSelector = 'td.nuni-color'
                this.filterList(nonNuniTasksSelector, nuniTasksSelector)
            } else {
                this.removeAllFilters()
            }
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
    const isUrgent = document.querySelector('#urgent').checked
    const isImportant = document.querySelector('#important').checked

    // Validate todo
    if (task === '') {
        alert('Add task...')
    } else {

        const id = localStorage.getItem('globalID')

        // Instantiate a todo task
        const todo = new Todo(id, task, prio, isDone, isUrgent, isImportant)

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

        // Sort tasks
        Store.sortTasks(e.target)

    } else {
        Store.completeTodo(e.target)
    }
})

document.querySelector('#task-matrix').addEventListener('click', e => {
    Filter.byMatrix(e.target)
})

function showDate() {
    n = new Date();
    y = n.getFullYear();
    m = n.getMonth() + 1;
    d = n.getDate();
    document.getElementById("date").innerHTML = d + "/" + m + "/" + y;
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    document.getElementById("day").innerHTML = days[n.getDay()]
}
showDate()

function darkMode() {
    document.querySelector('#darkmode').addEventListener('change', e => {
        if(e.target.checked) {
            document.querySelector('body').classList.add('dark-mode')
            document.querySelector('#alert-box').classList.add('dark-mode')
            document.querySelectorAll('tr').forEach(element => element.classList.add('dark-mode'))
            document.querySelectorAll('input[type="text"]').forEach(element => element.classList.add('dark-mode'))
        } else {
            document.querySelector('body').classList.remove('dark-mode')
            document.querySelector('#alert-box').classList.remove('dark-mode')
            document.querySelectorAll('tr').forEach(element => element.classList.remove('dark-mode'))
            document.querySelectorAll('input[type="text"]').forEach(element => element.classList.remove('dark-mode'))
        }
    })    
}
darkMode()

document.querySelector('#filter-drawer-icon').addEventListener('click', e => {
    document.querySelector('#task-matrix').classList.toggle('matrix-remove')
})
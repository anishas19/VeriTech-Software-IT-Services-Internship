document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    loadTasks();

    // Add task
    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskActions);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const task = {
            text: taskText,
            completed: false
        };

        addTaskToDOM(task);
        saveTask(task);
        taskInput.value = '';
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.className = 'task-item';

        li.innerHTML = `
            <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
            <div class="task-buttons">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        taskList.appendChild(li);
    }

    function handleTaskActions(e) {
        if (e.target.classList.contains('complete-btn')) {
            toggleCompleteTask(e.target);
        } else if (e.target.classList.contains('edit-btn')) {
            editTask(e.target);
        } else if (e.target.classList.contains('delete-btn')) {
            deleteTask(e.target);
        }
    }

    function toggleCompleteTask(button) {
        const li = button.parentElement.parentElement;
        const taskText = li.querySelector('.task-text');

        taskText.classList.toggle('completed');
        button.textContent = taskText.classList.contains('completed') ? 'Undo' : 'Complete';

        updateTaskInStorage(li);
    }

    function editTask(button) {
        const li = button.parentElement.parentElement;
        const taskText = li.querySelector('.task-text');

        const newTaskText = prompt('Edit task:', taskText.textContent);
        if (newTaskText !== null) {
            taskText.textContent = newTaskText;
            updateTaskInStorage(li);
        }
    }

    function deleteTask(button) {
        const li = button.parentElement.parentElement;
        taskList.removeChild(li);
        deleteTaskFromStorage(li);
    }

    function saveTask(task) {
        const tasks = getTasksFromStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasksFromStorage();
        tasks.forEach(task => addTaskToDOM(task));
    }

    function updateTaskInStorage(li) {
        const tasks = getTasksFromStorage();
        const taskText = li.querySelector('.task-text').textContent;
        const completed = li.querySelector('.task-text').classList.contains('completed');

        const index = Array.from(taskList.children).indexOf(li);
        tasks[index] = { text: taskText, completed: completed };

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function deleteTaskFromStorage(li) {
        const tasks = getTasksFromStorage();
        const index = Array.from(taskList.children).indexOf(li);

        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromStorage() {
        return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    }
});

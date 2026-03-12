const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
let taskCount = 0;

addTaskButton.addEventListener('click', () => {
    const usrTask = taskInput.value;
    const newTask = document.createElement('li');
    const deleteButton = document.createElement('button');
    if (usrTask === '') {
        alert('Please enter a task!');
    } else {
        newTask.textContent = usrTask;
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            newTask.remove();
            taskCount--;
            taskCounter.textContent = `Total Tasks: ${taskCount}`;
        });
        newTask.appendChild(deleteButton);
        taskList.appendChild(newTask);
        taskInput.value = '';
        taskCount++;
        taskCounter.textContent = `Total Tasks: ${taskCount}`;
    }

    newTask.addEventListener('click', () => {
        newTask.classList.toggle('completed');
    });
});


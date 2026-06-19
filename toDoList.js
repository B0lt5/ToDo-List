const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const completedCounter = document.getElementById('completedTasks');
let taskCount = 0;
let completedCount = 0;

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function addTask() {
    const usrTask = taskInput.value;
    const newTask = document.createElement('li');
    const newTaskText = document.createElement('span');
    const checkButton = document.createElement('input');
    checkButton.type = 'checkbox';
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-button');
    if (usrTask === '') {
        alert('Please enter a task!');
    } else {
        newTaskText.textContent = toTitleCase(usrTask);
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            newTask.remove();
            taskCount--;
            taskCounter.textContent = `Total Tasks: ${taskCount}`;
        });
        newTask.appendChild(checkButton);
        newTask.appendChild(newTaskText);
        newTask.appendChild(deleteButton);
        taskList.appendChild(newTask);
        taskInput.value = '';
        taskCount++;
        taskCounter.textContent = `Total Tasks: ${taskCount}`;
    }

    checkButton.addEventListener('change', () => {
        newTaskText.classList.toggle('completed');
        completedCount = document.querySelectorAll('.completed').length;
        completedCounter.textContent = `Completed: ${completedCount}`;
    });
};

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        addTask();
    };
});

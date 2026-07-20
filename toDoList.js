const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const completedCounter = document.getElementById('completedTasks');
const deleteAllButton = document.getElementById('deleteAllButton');
let taskCount = 0;
let completedCount = 0;

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function updateCounters() {
    taskCounter.textContent = `Total Tasks: ${taskCount}`;
    taskCounter.style.display = taskCount > 0 ? 'block' : 'none';

    const completedTasks = document.querySelectorAll('.line-through');
    completedCount = completedTasks.length;
    completedCounter.textContent = `Completed: ${completedCount}`;
    completedCounter.style.display = completedCount > 0 ? 'block' : 'none';
    
    deleteAllButton.style.display = taskCount >= 2 ? 'block' : 'none';
}

function addTask() {
    const usrTask = taskInput.value;
    const newTask = document.createElement('li');
    newTask.classList.add('flex', 'items-center', 'justify-between', 'p-[10px]');
    const newTaskText = document.createElement('span');
    newTaskText.classList.add('text-[#2AAEB6]', 'flex-grow', 'ml-2.5', 'text-lg');
    const checkButton = document.createElement('input');
    checkButton.type = 'checkbox';
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('px-[20px]', 'py-[10px]', 'text-[15px]', 'bg-[#0B0A4E]', 'text-[#EA00D9]', 'border-2', 'border-[#EA00D9]', 'rounded-[10px]', 'shadow-[0_0_10px_rgba(234,0,217,0.4)]', 'transition-all', 'duration-300','hover:bg-[#EA00D9]', 'hover:text-[#0B0A4E]', 'hover:-translate-y-1', 'hover:[text-shadow:0_0_10px_rgba(234,0,217,0.4)]');
    if (usrTask === '') {
        alert('Please enter a task!');
    } else {
        newTaskText.textContent = toTitleCase(usrTask);
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
            newTask.remove();
            taskCount--;
            updateCounters();
        });
        deleteAllButton.addEventListener('click', () => {
            taskList.innerHTML = '';
            deleteAllButton.style.display = 'none';
            taskCount = 0;
            completedCount = 0;
            updateCounters();
        });
        newTask.appendChild(checkButton);
        newTask.appendChild(newTaskText);
        newTask.appendChild(deleteButton);
        taskList.appendChild(newTask);
        taskInput.value = '';
        taskCount++;
        updateCounters();
    }

    checkButton.addEventListener('change', () => {
        newTaskText.classList.toggle('line-through');
        updateCounters();
    });
};

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', function(event) {
    if (event.key == 'Enter') {
        addTask();
    };
});

const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const completedCounter = document.getElementById('completedTasks');
const deleteAllButton = document.getElementById('deleteAllButton');

const STORAGE_KEY = 'tasks';

let tasks = loadTasks();

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function loadTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateCounters() {
    const taskCount = tasks.length;
    const completedCount = tasks.filter(task => task.completed).length;

    taskCounter.textContent = `Total Tasks: ${taskCount}`;
    taskCounter.style.display = taskCount > 0 ? 'block' : 'none';

    completedCounter.textContent = `Completed: ${completedCount}`;
    completedCounter.style.display = completedCount > 0 ? 'block' : 'none';

    deleteAllButton.style.display = taskCount >= 2 ? 'block' : 'none';
}

function createTaskElement(task) {
    const newTask = document.createElement('li');
    newTask.classList.add('flex', 'items-center', 'justify-between', 'p-[10px]');

    const newTaskText = document.createElement('span');
    newTaskText.classList.add('text-[#2AAEB6]', 'flex-grow', 'ml-2.5', 'text-lg');
    newTaskText.textContent = task.text;
    if (task.completed) {
        newTaskText.classList.add('line-through');
    }

    const checkButton = document.createElement('input');
    checkButton.type = 'checkbox';
    checkButton.checked = task.completed;
    checkButton.addEventListener('change', () => {
        task.completed = checkButton.checked;
        newTaskText.classList.toggle('line-through', task.completed);
        saveTasks();
        updateCounters();
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('px-[20px]', 'py-[10px]', 'text-[15px]', 'bg-[#0B0A4E]', 'text-[#EA00D9]', 'border-2', 'border-[#EA00D9]', 'rounded-[10px]', 'shadow-[0_0_10px_rgba(234,0,217,0.4)]', 'transition-all', 'duration-300','hover:bg-[#EA00D9]', 'hover:text-[#0B0A4E]', 'hover:-translate-y-1', 'hover:[text-shadow:0_0_10px_rgba(234,0,217,0.4)]');
    deleteButton.addEventListener('click', () => {
        tasks = tasks.filter(t => t !== task);
        saveTasks();
        renderTasks();
    });

    newTask.appendChild(checkButton);
    newTask.appendChild(newTaskText);
    newTask.appendChild(deleteButton);
    return newTask;
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
    updateCounters();
}

function addTask() {
    const usrTask = taskInput.value.trim();
    if (!usrTask) {
        alert('Please enter a task!');
        return;
    }
    tasks.push({ text: toTitleCase(usrTask), completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

deleteAllButton.addEventListener('click', () => {
    tasks = [];
    saveTasks();
    renderTasks();
});

addTaskButton.addEventListener('click', addTask);
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        addTask();
    }
});

renderTasks();

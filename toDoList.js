const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const completedCounter = document.getElementById('completedTasks');
const deleteAllButton = document.getElementById('deleteAllButton');
const emptyState = document.getElementById('emptyState');
const validationMessage = document.getElementById('validationMessage');

const STORAGE_KEY = 'tasks';

let tasks = loadTasks();
let draggedElement = null;

function newTaskId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function toTitleCase(str) {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

function loadTasks() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(stored)) return [];
    return stored.map(function(task) {
      return {
        id: task.id || newTaskId(),
        text: typeof task.text === 'string' ? task.text : '',
        completed: !!task.completed
      };
    });
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
    const progressPercent = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

    taskCounter.textContent = `Total: ${taskCount}`;
    completedCounter.textContent = `Completed: ${completedCount}`;

    // Progress bar width
    progressBar.style.width = `${progressPercent}%`;

    deleteAllButton.style.display = taskCount >= 2 ? 'block' : 'none';

    emptyState.style.display = taskCount === 0 ? 'block' : 'none';
}

function showValidation(message) {
    validationMessage.textContent = message;
    validationMessage.classList.add('visible');
    taskInput.classList.add('input-error');
}

function hideValidation() {
    validationMessage.textContent = '';
    validationMessage.classList.remove('visible');
    taskInput.classList.remove('input-error');
}

function startEdit(newTask, newTaskText, task) {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = task.text;
    editInput.className = 'edit-input';
    editInput.setAttribute('aria-label', 'Edit task');

    let finished = false;
    const finishEdit = (save) => {
        if (finished) return;
        finished = true;
        if (save) {
            const editedText = editInput.value.trim();
            if (editedText) {
                task.text = toTitleCase(editedText);
                saveTasks();
            }
        }
        newTask.replaceChild(newTaskText, editInput);
        updateCounters();
    };

    editInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            finishEdit(true);
        } else if (event.key === 'Escape') {
            finishEdit(false);
        }
    });
    editInput.addEventListener('blur', () => finishEdit(true));
    editInput.addEventListener('click', (event) => event.stopPropagation());

    newTask.replaceChild(editInput, newTaskText);
    editInput.focus();
    editInput.select();
}

function reorderTasksFromDom() {
    const orderedIds = Array.from(taskList.querySelectorAll('li')).map(li => li.dataset.taskId);
    const tasksById = new Map(tasks.map(task => [task.id, task]));
    return orderedIds.map(id => tasksById.get(id)).filter(task => task !== undefined);
}

function setupDragAndDrop(newTask, task) {
    newTask.draggable = true;
    newTask.dataset.taskId = task.id;

    newTask.addEventListener('dragstart', (event) => {
        if (event.target.tagName === 'INPUT') {
            event.preventDefault();
            return;
        }
        draggedElement = newTask;
        newTask.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', task.id);
    });

    newTask.addEventListener('dragover', (event) => {
        if (!draggedElement || draggedElement === newTask) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        newTask.classList.add('drag-over');
        const rect = newTask.getBoundingClientRect();
        const after = (event.clientY - rect.top) > rect.height / 2;
        if (after) {
            newTask.after(draggedElement);
        } else {
            newTask.before(draggedElement);
        }
    });

    newTask.addEventListener('dragleave', () => {
        newTask.classList.remove('drag-over');
    });

    newTask.addEventListener('drop', (event) => {
        event.preventDefault();
    });

    newTask.addEventListener('dragend', () => {
        draggedElement = null;
        newTask.classList.remove('dragging', 'drag-over');
        taskList.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        tasks = reorderTasksFromDom();
        saveTasks();
        renderTasks();
    });
}

function createTaskElement(task) {
    const newTask = document.createElement('li');
    newTask.classList.add('flex', 'items-center', 'justify-between', 'gap-2', 'sm:gap-4', 'p-2', 'sm:p-[10px]');

    const newTaskText = document.createElement('span');
    newTaskText.classList.add('text-[#2AAEB6]', 'flex-grow', 'ml-1.5', 'sm:ml-2.5', 'text-base', 'sm:text-lg', 'cursor-pointer', 'select-none', 'break-words', 'min-w-0');
    newTaskText.textContent = task.text;
    if (task.completed) {
        newTaskText.classList.add('line-through');
    }

    const checkButton = document.createElement('input');
    checkButton.type = 'checkbox';
    checkButton.className = 'neon-checkbox';
    checkButton.checked = task.completed;
    checkButton.setAttribute('aria-label', `Mark "${task.text}" as completed`);
    checkButton.addEventListener('change', () => {
        const found = tasks.find(t => t.id === task.id);
        if (found) {
            found.completed = checkButton.checked;
            newTaskText.classList.toggle('line-through', found.completed);
            if (found.completed) {
                newTaskText.classList.add('completed-animating');
                setTimeout(() => newTaskText.classList.remove('completed-animating'), 600);
            } else {
                newTaskText.classList.remove('completed-animating');
            }
            saveTasks();
            updateCounters();
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete "${task.text}"`);
    deleteButton.classList.add('shrink-0', 'px-3', 'py-1.5', 'sm:px-[20px]', 'sm:py-[10px]', 'text-xs', 'sm:text-[15px]', 'bg-[#0B0A4E]', 'text-[#EA00D9]', 'border-2', 'border-[#EA00D9]', 'rounded-[10px]', 'shadow-[0_0_10px_rgba(234,0,217,0.4)]', 'transition-all', 'duration-300','hover:bg-[#EA00D9]', 'hover:text-[#0B0A4E]', 'hover:-translate-y-1', 'hover:[text-shadow:0_0_10px_rgba(234,0,217,0.4)]');
    deleteButton.addEventListener('click', () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
    });

    newTaskText.addEventListener('dblclick', (event) => {
        event.stopPropagation();
        startEdit(newTask, newTaskText, task);
    });

    setupDragAndDrop(newTask, task);

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
        showValidation('Please enter a task!');
        taskInput.focus();
        return;
    }
    hideValidation();
    tasks.push({ id: newTaskId(), text: toTitleCase(usrTask), completed: false });
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
taskInput.addEventListener('input', hideValidation);

const footerYear = document.getElementById('footerYear');
if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
}

renderTasks();
saveTasks();

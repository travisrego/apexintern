const input = document.getElementById('taskInput');
const list = document.getElementById('taskList');

window.onload = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(addTaskToDOM);
};

function addTask() {
  const task = input.value.trim();
  if (task) {
    addTaskToDOM(task);
    saveToLocal(task);
    input.value = '';
  }
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.textContent = task;
  li.onclick = () => {
    li.remove();
    removeFromLocal(task);
  };
  list.appendChild(li);
}

function saveToLocal(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeFromLocal(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks = tasks.filter(t => t !== task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

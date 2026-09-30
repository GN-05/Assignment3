const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const message = document.querySelector('#message');
const list = document.querySelector('#task-list');

function save() {
  const json = JSON.stringify(tasks);
  localStorage.setItem('tasks', json);
}

function load() {
  const raw = localStorage.getItem('tasks');
  return JSON.parse(raw) || [];
}

let tasks = load();

function taskToListItem(task) {
  const li = document.createElement('li');
  li.dataset.id = task.id;

  const span = document.createElement('span');
  span.textContent = task.text;
  if (task.done) {
    span.classList.add('done');
  }
  li.append(span);

  const button = document.createElement('button');
  button.textContent = 'Delete';
  button.classList.add('delete');
  li.append(button);

  return li;
}

function renderTasks() {
  list.innerHTML = '';
  tasks
    .map(taskToListItem)
    .forEach(li => list.append(li));
}

function addTask(text) {
  let newId = 1;
  if (tasks.length > 0) {
    newId = tasks[tasks.length - 1].id + 1;
  }

  tasks.push({ id: newId, text: text, done: false });
  save();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  save();
  renderTasks();
}

function toggleTask(id) {
  tasks.forEach(task => {
    if (task.id === id) {
      task.done = !task.done;
    }
  });
  save();
  renderTasks();
}

function handleSubmit(e) {
  e.preventDefault();

  const text = input.value.trim();

  if (!text) {
    message.textContent = 'Please type a task first.';
    return;
  }

  message.textContent = '';
  addTask(text);
  input.value = '';
}

function handleListClick(e) {
  const li = e.target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.closest('.delete')) {
    deleteTask(id);
    return;
  }

  toggleTask(id);
}

form.addEventListener('submit', handleSubmit);
list.addEventListener('click', handleListClick);

renderTasks();

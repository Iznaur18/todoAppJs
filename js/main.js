// Находим элементы в HTML

const form = document.querySelector("#form");
const taskInput = document.querySelector("#taskInput");
const tasksList = document.querySelector("#tasksList");
const emptyList = document.querySelector("#emptyList");

// Add task
form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

let tasks = [];

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  tasks.forEach((task) => {
    renderTask(task)
  })
}

checkEmptyList()

// ---------------------------------------------------------------------------------------

function addTask(event) {
  event.preventDefault();

  // Достаем текст задачи из поля ввода
  const taskText = taskInput.value;

  // Описываем задачу в виде объекта
  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем задачу в массив с задачами
  tasks.push(newTask);

  // Добавляем задачу в localStorage
  saveToLocalStorge()

  renderTask(newTask)

  // Ояищаем поле ввода и возвращаем фокус на него
  taskInput.value = "";
  taskInput.focus();

  checkEmptyList()
}

// ---------------------------------------------------------------------------------------

function deleteTask(event) {
  // Проверяем если клик был не по кнопке "Удалить задачу"
  if (event.target.dataset.action !== "delete") return;

  // Проверяем что клик был по кнопке "удалить задачу"
  const parentNode = event.target.closest(".list-group-item");

  // Определяем ID задачи
  const id = +parentNode.id;

  // Удаляем задачу из массива с задачами, так же удаляем и через filter
  tasks = tasks.filter((task) => task.id !== id);

  // Добавляем задачу в localStorage
  saveToLocalStorge()

  // Удаляем задачу из разметки
  parentNode.remove();

  checkEmptyList()
}

// ---------------------------------------------------------------------------------------

function doneTask(event) {
  // Проверяем что клик был HE по кнопке "Задача выполнена"
  if (event.target.dataset.action !== "done") return;

  // Проверяем что клик был по кнопке "Задача выполнена"
  const parentNode = event.target.closest(".list-group-item");

  // Определяем ID задачу
  const id = +parentNode.id;
  const task = tasks.find((task) => task.id === id);
  task.done = !task.done;

  const taskTitle = parentNode.querySelector(".task-title");
  taskTitle.classList.toggle("task-title--done");

  // Добавляем задачу в localStorage
  saveToLocalStorge()
}

// ---------------------------------------------------------------------------------------

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListElement = `
    <li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
    <div class="empty-list__title">Список дел пуст</div>
    </li>
    `;
    tasksList.insertAdjacentHTML('afterbegin', emptyListElement)
  };

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('#emptyList')
    emptyListEl ? emptyListEl.remove() : null;
  }
}

// ---------------------------------------------------------------------------------------

function saveToLocalStorge () {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask (task) {
  // Формируем css класс
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  // Формируем разметку для новой задачи
  const taskHTML = `
  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${task.text}</span>
    <div class="task-item__buttons">
      <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
      </button>
      <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
      </button>
    </div>
  </li>`;

  // Добавляем задачу в список
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
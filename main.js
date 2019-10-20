var buttonAddTask = document.querySelector('#button-add')
var buttonClear = document.querySelector('#button-clear');
var buttonMakeList = document.querySelector('#button-create');
var cardArea = document.querySelector('#card-area');
var inputTask = document.querySelector('#input-task');
var inputTitle = document.querySelector('#input-title');
var inputSearch = document.querySelector('#input-search');
var buttonFilter = document.querySelector('#button-filter');
var navBar = document.querySelector('nav');
var sideBar = document.querySelector('aside');
var sidebarList = document.querySelector('#list-items');

var masterArray = [];

cardArea.addEventListener('click', handleCardArea);
navBar.addEventListener('keyup', handleNav);
sideBar.addEventListener('click', handleSideBarButtons);
sideBar.addEventListener('keyup', handleSideBarInputs);
window.addEventListener('DOMContentLoaded', handlePageLoad);

function handleNav(e) {
  e.preventDefault(e);
  if (e.target.id === 'input-search') {
    filterBySearch();
    deleteAlertMessage();
  }
}

function handleSideBarInputs(e) {
  e.preventDefault();
  if (e.target.id === 'input-title') {
    enableMakeList();
    enableClear();
    deleteAlertMessage();
  } else if (e.target.id === 'input-task') {
    enableAdd();
    enableClear();
    deleteAlertMessage();
  }
}

function handleSideBarButtons(e) {
  e.preventDefault();
  if (e.target.id === 'button-add') {
    displayTask();
    addTask();
    enableClear();
    deleteAlertMessage();
  } else if (e.target.id === 'button-delete-item') {
    e.target.parentNode.remove();
    enableMakeList();
    enableClear()
  } else if (e.target.id === 'button-create') {
    createToDoList(e);
    enableClear();
    enableMakeList();
    deleteAlertMessage();
  } else if (e.target.id === 'button-clear') {
    clearAll();
    enableAdd();
    deleteAlertMessage();
  } else if (e.target.id === 'button-filter') {
    filterByUrgency();
  }
}

function handleCardArea(e) {
  e.preventDefault();
  if (e.target.id === 'button-complete') {
    completeTask(e);
  }
  if (e.target.id === 'button-urgent') {
    updateUrgency(e);
  }
  if (e.target.id === 'button-delete-card') {
    deleteCardHandler(e);
  }
}

// FUNCTIONS

function handlePageLoad() {
  if (JSON.parse(localStorage.getItem("globalStorage"))) {
    restoreData();
    restoreDOM();
  }
}

function restoreData() {
  var recoveredData = JSON.parse(localStorage.getItem('globalStorage'))
    .map(function (toDo) {
      return new ToDoList({
        id: toDo.id,
        title: toDo.title,
        tasksArray: toDo.tasksArray,
        urgent: toDo.urgent
      });
    });

  masterArray = recoveredData;
}

function restoreDOM() {
  for (var i = 0; i < masterArray.length; i++) {
    displayCards(masterArray[i]);
  }
}

function displayTask() {
  sidebarList.insertAdjacentHTML(
    'beforeend', `
		<li id="task" identifier="${Date.now()}">
			<img id="button-delete-item" src="images/delete.svg">
			<p>${inputTask.value}</p>
		</li>`
  );
  inputTask.value = '';
  enableAdd();
  enableMakeList();
}

function createToDoList() {
  var toDoList = new ToDoList({
    id: Date.now(),
    title: inputTitle.value,
    tasksArray: addTask(),
    urgent: false
  });

  masterArray.push(toDoList);
  displayCards(toDoList);
  toDoList.saveToStorage(masterArray);
  sidebarList.innerHTML = '';
  inputTitle.value = '';
}

function addTask() {
  var tasksArray = document.querySelectorAll('#task');
  var appendTasks = [];

  for (var i = 0; i < tasksArray.length; i++) {
    appendTasks.push({
      id: parseInt(tasksArray[i].getAttribute('identifier')),
      text: tasksArray[i].innerText,
      complete: false
    });
  }

  return appendTasks;
}

function displayCards(toDoList) {
  var htmlBlock = `      
	<article 
		identifier="${toDoList.id}" ${toDoList.urgent ? 'class="article__card--yellow"' : ''} >
		<header>
			<h2>${toDoList.title}</h2>
		</header>
		<section class="card__main ${toDoList.urgent ? 'card__border--yellow' : ''}" id="main-content">
			<ul>${pushTasksToDom(toDoList)}</ul >
		</section >
		<footer>
			<button ${toDoList.urgent ? 'class="card__text--red"' : ''} id="error-message">
				<img id="button-urgent" class="button-urgent ${toDoList.urgent ? 'card__urgent--img' : ''}" src="images/urgent.svg">
				<h6>URGENT</h6>
			</button>
			<button>
				<img id="button-delete-card" class="card__delete--img" src="images/delete.svg">
				<h6 class="delete-text-active ${toDoList.urgent ? 'card__text--black' : ''}">DELETE</h6>
			</button>
		</footer>
	</article>`
  cardArea.insertAdjacentHTML('afterbegin', htmlBlock);
}

function pushTasksToDom(toDoList) {
  var taskList = '';
  for (var i = 0; i < toDoList.tasksArray.length; i++) {
    taskList +=
      `<li identifier="
			${toDoList.tasksArray[i].id}" 
			${toDoList.tasksArray[i].complete
        ? 'class="card__text--blue"'
        : ''} 
				><img src="images/checkbox.svg" id="button-complete" 
				${toDoList.tasksArray[i].complete
        ? 'class="card__img--check"'
        : ''}><p>
					${toDoList.tasksArray[i].text}</p></li>`
  }
  return taskList;
}

function updateUrgency(e) {
  var listIndex = findIndex(retrieveId(e, 'article'), masterArray);
  masterArray[listIndex].updateToDo(masterArray);
  var urgent = masterArray[listIndex].urgent;
  urgent ? styleUrgency(e, 'add') : styleUrgency(e, 'remove')
  deleteAlertMessage();
}

function styleUrgency(e, method) {
  e.target.closest('article')
    .classList[method]('article__card--yellow')
  e.target.closest('article')
    .querySelector('#main-content')
    .classList[method]('card__border--yellow')
  e.target.classList[method]('card__urgent--img')
  e.target.closest('footer')
    .querySelector('.delete-text-active')
    .classList[method]('card__text--black')
  e.target.closest('button')
    .classList[method]('card__text--red')
}

function filterByUrgency() {
  cardArea.innerHTML = '';
  inputSearch.value = '';
  var urgentArray = masterArray.filter(function (list) {
    return list.urgent === true;
  });
  buttonFilter.getAttribute('state') === "off"
    ? turnFilterOn(urgentArray)
    : turnFilterOff()
}

function turnFilterOn(array) {
  buttonFilter.setAttribute('state', 'on');
  buttonFilter.classList.add('aside__button--orange');
  buttonFilter.innerHTML = 'Show All Cards';
  if (array.length) {
    for (var i = 0; i < array.length; i++) {
      displayCards(array[i]);
    }
  } else {
    buttonFilter.insertAdjacentHTML('afterend',
      '<p id="prioritize">prioritize some cards!</p>')
  }
}

function turnFilterOff() {
  var prioritize = document.querySelector('#prioritize');
  buttonFilter.setAttribute('state', 'off');
  buttonFilter.classList.remove('aside__button--orange');
  buttonFilter.innerHTML = 'Filter by Urgency';
  for (var i = 0; i < masterArray.length; i++) {
    displayCards(masterArray[i]);
  }
  if (prioritize) {
    prioritize.remove()
  }
}

function filterBySearch() {
  var urgentArray = masterArray.filter(function (list) {
    return list.urgent === true;
  });

  var arraySelection = buttonFilter.getAttribute('state') === "on"
    ? urgentArray
    : masterArray;
  var inputSearch = document.querySelector('#input-search').value.toLowerCase();
  var matchingCards = arraySelection.filter(function (list) {
    return list.title.toLowerCase().includes(inputSearch);
  })

  cardArea.innerHTML = '';
  for (var i = 0; i < matchingCards.length; i++) {
    displayCards(matchingCards[i]);
  }
}

function completeTask(e) {
  var listIndex = findIndex(retrieveId(e, 'article'), masterArray);
  var taskId = retrieveId(e, 'li');
  var taskIndex = masterArray[listIndex].tasksArray.findIndex(function (task) {
    return task.id === parseInt(taskId);
  })

  masterArray[listIndex]
    .tasksArray[taskIndex]
    .complete = !masterArray[listIndex].tasksArray[taskIndex].complete;
  var completeStatus = masterArray[listIndex].tasksArray[taskIndex].complete
  checkPoint(e);
  completeStatus
    ? styleCompletedTask(e, 'add')
    : styleCompletedTask(e, 'remove');
  deleteAlertMessage();
}

function styleCompletedTask(e, method) {
  e.target.closest('li').classList[method]('card__text--blue')
  e.target.closest('img').classList[method]('card__img--check')
}

function deleteCardHandler(e) {
  var checkArray = [];
  var listIndex = findIndex(retrieveId(e, 'article'), masterArray);
  var tasks = masterArray[listIndex].tasksArray;
  deleteAlertMessage();
  for (var i = 0; i < tasks.length; i++) {
    checkArray.push(tasks[i].complete);
  }

  checkArray.includes(false)
    ? alertMessage(e)
    : (deleteCard(e), deleteAlertMessage());
}

function alertMessage(e) {
  e.target.closest('footer').querySelector('#delete-message')
    ? ''
    : e.target.closest('footer').querySelector('#error-message').insertAdjacentHTML('afterend', `<p id="delete-message">finish all <br /> tasks first!</p>`)
}

function deleteAlertMessage() {
  var checkForId = document.querySelector('#delete-message');

  if (checkForId) {
    checkForId.remove();
  }
}

function deleteCard(e) {
  var listIndex = findIndex(retrieveId(e, 'article'), masterArray);

  masterArray[listIndex].deleteFromStorage(masterArray)
  e.target.closest('article').remove();
}

function checkPoint(e) {
  var listId = retrieveId(e, 'article');
  var list = masterArray.find(function (list) {
    return list.id === parseInt(listId);
  });
  list.saveToStorage(masterArray);
}

function retrieveId(e, location) {
  var taskId = e.target.closest(location).getAttribute('identifier');
  return taskId;
}

function findIndex(taskId, globalArray) {
  return globalArray.findIndex(function (task) {
    return task.id === parseInt(taskId);
  })
}

function clearAll() {
  inputTask.value = '';
  inputTitle.value = '';
  sidebarList.innerHTML = '';
  enableMakeList();
  enableClear();
}

function enableClear() {
  inputTitle.value || sidebarList.innerHTML || inputTask.value
    ? (buttonClear.disabled = false)
    : (buttonClear.disabled = true);
}

function enableAdd() {
  buttonAddTask.disabled = !inputTask.value;
}

function enableMakeList() {
  !inputTitle.value || !sidebarList.innerHTML
    ? (buttonMakeList.disabled = true)
    : (buttonMakeList.disabled = false);
}

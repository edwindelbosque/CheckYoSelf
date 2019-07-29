var buttonAddTask = document.querySelector('#button-add')
var buttonClear = document.querySelector('#button-clear');
var buttonMakeList = document.querySelector('#button-create');
var cardArea = document.querySelector('.card-area');
var displaySidebarItems = document.querySelector('#list-items');
var inputTask = document.querySelector('#input-item');
var inputTitle = document.querySelector('#input-title');
var listItems = document.querySelector('#list-items');
var navBar = document.querySelector('nav');
var sideBar = document.querySelector('aside');

var globalLists = [];
var globalTasks = [];

cardArea.addEventListener('click', handleCardArea);
navBar.addEventListener('keyup', handleNav);
sideBar.addEventListener('click', handleSideBarButtons);
sideBar.addEventListener('keyup', handleSideBarInputs);
window.addEventListener('DOMContentLoaded', handlePageLoad);

// EVENT DELEGATIONS

function handleNav(e) {
	e.preventDefault(e);
	if (e.target.id === 'input-search') {
	}
}

function handleSideBarInputs(e) {
	e.preventDefault();
	if (e.target.id === 'input-title') {
		enableMakeList();
		enableClear();
	}
	else if (e.target.id === 'input-item') {
		enableAdd();
		enableClear();
	}
}

function handleSideBarButtons(e) {
	e.preventDefault();
	if (e.target.id === 'button-add') {
		addTask();
		enableClear()
	} else if (e.target.id === 'button-delete-item') {
		deleteTask(e);
		enableMakeList();
		enableClear()
	} else if (e.target.id === 'button-create') {
		createToDoList(e);
		enableClear();
		enableMakeList();
	} else if (e.target.id === 'button-clear') {
		clearAll();
		enableAdd();
	} else if (e.target.id === 'button-filter') {
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
		deleteHandler(e);
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
	var recoveredData = JSON.parse(localStorage.getItem('globalStorage')).map(function (toDo) {
		return new ToDoList({ id: toDo.id, title: toDo.title, tasksArray: toDo.tasksArray, urgent: toDo.urgent });
	});

	globalLists = recoveredData;
}

function restoreDOM() {
	for (var i = 0; i < globalLists.length; i++) {
		displayCards(globalLists[i]);
	}
}

function addTask() {
	var taskInput = document.querySelector('#input-item').value;
	var task = ({ id: Date.now(), text: taskInput, complete: false });
	globalTasks.push(task);
	displayTask(task);
}

function displayTask(task) {
	listItems.insertAdjacentHTML(
		'beforeend',
		`<li key="${task.id}"><img id="button-delete-item" src="images/delete.svg"><p>${task.text}</p></li>`
	);
	document.querySelector('#input-item').value = '';
	enableAdd();
	enableMakeList();
}

function deleteTask(e) {
	e.target.parentNode.remove();
	var taskIndex = findIndex(retrieveId(e, 'li'), globalTasks);
	globalTasks.splice(taskIndex, 1);
}

function createToDoList() {
	var toDoList = new ToDoList({
		id: Date.now(),
		title: document.querySelector('#input-title').value,
		tasksArray: globalTasks,
		urgent: false
	});

	globalLists.push(toDoList);
	displayCards(toDoList);
	toDoList.saveToStorage(globalLists);
	displaySidebarItems.innerHTML = '';
	inputTitle.value = '';
	globalTasks = [];
}

function displayCards(toDoList) {
	var htmlBlock = `      
	<article key="${toDoList.id}" ${toDoList.urgent ? 'class="urgent-card"' : ''} >
		<header>
			<h2 contenteditable>${toDoList.title}</h2>
		</header>
		<section class="card-main-section ${toDoList.urgent ? 'urgent-content' : ''}" id="main-content">
			<ul>${pushTasksToDom(toDoList)}</ul >
		</section >
		<footer>
			<button ${toDoList.urgent ? 'class="check-urgent-text"' : ''}>
				<img id="button-urgent" class="button-urgent ${toDoList.urgent ? 'button-urgent-active' : ''}" src="images/urgent.svg">
				<h6>URGENT</h6>
			</button>
			<button>
				<img id="button-delete-card" class="button-delete-card" src="images/delete.svg">
				<h6 class="delete-text-active ${toDoList.urgent ? 'urgent-buttons' : ''}">DELETE</h6>
			</button>
		</footer>
	</article>`
	cardArea.insertAdjacentHTML('afterbegin', htmlBlock);
}

function pushTasksToDom(toDoList) {
	var taskList = '';
	for (var i = 0; i < toDoList.tasksArray.length; i++) {
		taskList +=
			`<li key="
			${toDoList.tasksArray[i].id}" 
			${toDoList.tasksArray[i].complete
				? 'class="check-task-text"' : ''} 
				><img src="images/checkbox.svg" id="button-complete" 
				${toDoList.tasksArray[i].complete
				? 'class="check-task-icon"' : ''}><p>
					${toDoList.tasksArray[i].text}</p></li>`
	}
	return taskList;
}

function updateUrgency(e) {
	var listIndex = findIndex(retrieveId(e, 'article'), globalLists);
	globalLists[listIndex].updateToDo(globalLists);
	var urgentStatus = globalLists[listIndex].urgent;
	styleUrgency(e, urgentStatus);
};

function styleUrgency(e, urgentStatus) {
	urgentStatus
		? (e.target.closest('article').classList.add('urgent-card'),
			e.target.closest('article').querySelector('#main-content').classList.add('urgent-content'),
			e.target.classList.add('button-urgent-active'),
			e.target.closest('footer').querySelector('.delete-text-active').classList.add('urgent-buttons'),
			e.target.closest('button').classList.add('check-urgent-text'))
		: (e.target.closest('article').classList.remove('urgent-card'),
			e.target.closest('article').querySelector('#main-content').classList.remove('urgent-content'),
			e.target.classList.remove('button-urgent-active'),
			e.target.closest('footer').querySelector('.delete-text-active').classList.remove('urgent-buttons'),
			e.target.closest('button').classList.remove('check-urgent-text'))
}

function completeTask(e) { // need to fix this mess
	var listIndex = findIndex(retrieveId(e, 'article'), globalLists);
	var taskId = retrieveId(e, 'li');

	var taskIndex = globalLists[listIndex].tasksArray.findIndex(function (task) {
		return task.id === parseInt(taskId);
	})

	globalLists[listIndex].tasksArray[taskIndex].complete =
		!globalLists[listIndex].tasksArray[taskIndex].complete;

	checkPoint(e);
	console.log(globalLists[listIndex].tasksArray[taskIndex].complete)
	styleCompletedTask(e, globalLists[listIndex].tasksArray[taskIndex].complete);
}

function styleCompletedTask(e, complete) {
	complete
		? (e.target.closest('li').classList.add('check-task-text'),
			e.target.closest('img').classList.add('check-task-icon'))
		: (e.target.closest('li').classList.remove('check-task-text'),
			e.target.closest('img').classList.remove('check-task-icon'))
}

function deleteHandler(e) {
	var checkArray = [];
	var listIndex = findIndex(retrieveId(e, 'article'), globalLists);
	var tasks = globalLists[listIndex].tasksArray;

	for (var i = 0; i < tasks.length; i++) {
		checkArray.push(tasks[i].complete);
	}

	checkArray.includes(false) ? console.log('complete tasks first!') : deleteCard(e);
}

function deleteCard(e) {
	var listIndex = findIndex(retrieveId(e, 'article'), globalLists);

	globalLists[listIndex].deleteFromStorage(globalLists)
	e.target.closest('article').remove();
}

function checkPoint(e) {
	var listId = retrieveId(e, 'article');
	var list = globalLists.find(function (list) {
		return list.id === parseInt(listId);
	});
	list.saveToStorage(globalLists);
}

function retrieveId(e, location) {
	var taskId = e.target.closest(location).getAttribute('key');
	return taskId;
};

function findIndex(taskId, globalArray) {
	return globalArray.findIndex(function (task) {
		return task.id === parseInt(taskId);
	})
}

function clearAll() {
	document.querySelector('#input-item').value = '';
	inputTitle.value = '';
	displaySidebarItems.innerHTML = '';
	enableMakeList();
	enableClear();
}

function enableClear() {
	inputTitle.value || displaySidebarItems.innerHTML || inputTask.value
		? (buttonClear.disabled = false)
		: (buttonClear.disabled = true);
}

function enableAdd() {
	buttonAddTask.disabled = !inputTask.value;
}

function enableMakeList() {
	!inputTitle.value || !displaySidebarItems.innerHTML
		? (buttonMakeList.disabled = true)
		: (buttonMakeList.disabled = false);
}

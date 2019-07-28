// querySelectors

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

// global variables

var globalLists = [];
var globalTasks = [];

// event listeners

cardArea.addEventListener('click', handleCardArea);
navBar.addEventListener('keyup', handleNav);
sideBar.addEventListener('click', handleSideBarButtons);
sideBar.addEventListener('keyup', handleSideBarInputs);
// window.addEventListener('DOMContentLoaded', handlePageLoad);

// event delegations

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
	} else if (e.target.id === 'input-item') {
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
		deleteItem(e);
		retrieveTaskId(e);
		enableMakeList();
		enableClear()
	} else if (e.target.id === 'button-create') {
		instantiateToDoList(e);
		enableClear();
	} else if (e.target.id === 'button-clear') {
		clearAll();
		enableAdd();
	} else if (e.target.id === 'button-filter') {
	}
}

function handleCardArea(e) {
	e.preventDefault();
	if (e.target.id === 'button-urgent') {
	}
	if (e.target.id === 'button-delete-card') {
	}
}

// functions

// function handlePageLoad() {
// 	populateCards(globalLists);
// }

function addTask() {
	var taskInput = document.querySelector('#input-item').value;
	var task = new Task({ id: Date.now(), text: taskInput, complete: false });

	globalTasks.push(task);
	displayTask(task);
}

function displayTask(object) {
	listItems.insertAdjacentHTML(
		'beforeend',
		`<li data-set="${object.id}"><img id="button-delete-item" src="images/delete.svg">${object.text}</li>`
	);
	document.querySelector('#input-item').value = '';
	enableAdd();
	enableMakeList();
}

function instantiateToDoList() {
	var toDoList = new ToDoList({
		id: Date.now(),
		title: document.querySelector('#input-title').value,
		tasksArray: globalTasks,
		urgent: false
	});
	globalLists.push(toDoList);
	toDoList.saveToStorage(globalLists);
	displaySidebarItems.innerHTML = '';
	inputTitle.value = '';
	displayCards(toDoList, globalTasks);
	enableMakeList();
	globalTasks = [];
}

function displayCards(toDoList) {
	var htmlBlock = `      
	<article>
		<header>
			<h2>${toDoList.title}</h2>
		</header>
		<section class="card-main-section">
			<ul>${pushTasksToDom(toDoList)}</ul >
		</section >
	<footer>
		<button>
			<img id="button-urgent" class="button-urgent" src="images/urgent.svg">
				<h6>URGENT</h6>
			</button>
			<button>
				<img id="button-delete-card" class="button-delete-card" src="images/delete.svg">
					<h6>DELETE</h6>
			</button>
		</footer>
	</article>`

	cardArea.insertAdjacentHTML('afterbegin', htmlBlock);
}

function pushTasksToDom(toDoList) {
	var taskList = '';
	for (var i = 0; i < toDoList.tasksArray.length; i++) {
		taskList +=
			`<li><img src="images/checkbox.svg"><p>${toDoList.tasksArray[i].text}</p></li>`
	}
	return taskList;
}

// function populateCards(globalLists) {
// 	for (i = 0; i < globalLists.length; i++) {
// 		displayCards(globalLists[i]);
// 	}
// }

function repopulateLists() {
	localStorage.getItem(listsArray);
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

function deleteItem(e) {
	if (e.target.id === 'button-delete-item') {
		e.target.parentNode.remove();
		var taskIndex = findTaskIndex(retrieveTaskId(e));
		globalTasks.splice(taskIndex, 1);
	}
}

function retrieveTaskId(e) {
	var taskId = e.target.closest('li').getAttribute('data-set');
	return taskId;
};

function findTaskIndex(taskId) {
	return globalTasks.findIndex(function (task) {
		return task.id === parseInt(taskId);
	})
}
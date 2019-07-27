var objectsArray = [];
var navBar = document.querySelector('nav');
var sideBar = document.querySelector('aside');

navBar.addEventListener('keyup', handleNav);
sideBar.addEventListener('keyup', handleSideBarInputs);
sideBar.addEventListener('click', handleSideBarButtons);
var inputTitle = document.querySelector('#input-title');
var displaySidebarItems = document.querySelector('#list-items');

function handleNav(e) {
	e.preventDefault(e);
	if (e.target.id === 'input-search') {
	}
}

function handleSideBarInputs(e) {
	e.preventDefault();
	if (e.target.id === 'input-title') {
	} else if (e.target.id === 'input-item') {
		enableButton();
	}
}

function handleSideBarButtons(e) {
	e.preventDefault();
	if (e.target.id === 'button-add') {
		addTask();
	} else if (e.target.id === 'button-delete-item') {
		deleteItem(e);
	} else if (e.target.id === 'button-create') {
		instantiateToDoList(e);
	} else if (e.target.id === 'button-clear') {
		console.log('clear!');
	} else if (e.target.id === 'button-filter') {
		console.log('filter!');
	}
}

function addTask() {
	var taskInput = document.querySelector('#input-item').value;
	var listItems = document.querySelector('#list-items');
	var tasksObject = [];
	var taskItem = { id: Date.now(), text: taskInput, complete: false };

	tasksObject.push(taskItem);
	listItems.insertAdjacentHTML(
		'afterbegin',
		`<li><img id="button-delete-item" src="images/delete.svg" data-set="${Date.now()}"> ${taskInput}</li>`
	);
	document.querySelector('#input-item').value = '';
	enableButton();
	console.log(tasksObject);
	return tasksObject;
}

function instantiateToDoList() {
	var toDoList = new ToDoList({
		id: Date.now(),
		title: document.querySelector('#input-title').value,
		tasksArray: addTask(),
		urgent: false
	});
	objectsArray.push(toDoList);
	displaySidebarItems.innerHTML = '';
	inputTitle.value = '';
	console.log(toDoList);
}

function enableButton() {
	document.querySelector('#button-add').disabled = !document.querySelector('#input-item').value;
}

function deleteItem(e) {
	if (e.target.id === 'button-delete-item') {
		e.target.parentNode.remove();
	}
}

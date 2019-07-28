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
		deleteItem(e);
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

function addTask() {
	var taskInput = document.querySelector('#input-item').value;
	var task = new Task({ id: Date.now(), text: taskInput, complete: false });

	globalTasks.push(task);
	displayTask(task);
}

function displayTask(object) {
	listItems.insertAdjacentHTML(
		'beforeend',
		`<li key="${object.id}"><img id="button-delete-item" src="images/delete.svg"><p>${object.text}</p></li>`
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
	displayCards(toDoList);
	enableMakeList();
	globalTasks = [];
}

function displayCards(toDoList) {
	var htmlBlock = `      
	<article key="${toDoList.id}" >
		<header>
			<h2 contenteditable>${toDoList.title}</h2>
		</header>
		<section class="card-main-section" id="main-content">
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
			`<li key="${toDoList.tasksArray[i].id}" contenteditable><img src="images/checkbox.svg" id="button-complete"><p>${toDoList.tasksArray[i].text}</p></li>`
	}
	return taskList;
}

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
	e.target.parentNode.remove();
	var taskIndex = findTaskIndex(retrieveTaskId(e, 'li'));
	globalTasks.splice(taskIndex, 1);
}

function retrieveTaskId(e, location) {
	var taskId = e.target.closest(location).getAttribute('key');
	return taskId;
};

function findTaskIndex(taskId) {
	return globalTasks.findIndex(function (task) {
		return task.id === parseInt(taskId);
	})
}

function retrieveListId(e, location) {
	var listId = e.target.closest(location).getAttribute('key');
	return listId;
}

function findListIndex(listId) {
	return globalLists.findIndex(function (list) {
		return list.id === parseInt(listId);
	})
}

function updateUrgency(e) {
	var listIndex = findListIndex(retrieveListId(e, 'article'));
	globalLists[listIndex].urgent = !globalLists[listIndex].urgent;
	var urgentStatus = globalLists[listIndex].urgent;

	urgentStatus
		? (e.target.closest('article').classList.add('urgent-card'),
			e.target.closest('article').querySelector('#main-content').classList.add('urgent-content'),
			e.target.classList.add('button-urgent-active'),
			e.target.closest('footer').classList.add('urgent-buttons'))
		: (e.target.closest('article').classList.remove('urgent-card'),
			e.target.closest('article').querySelector('#main-content').classList.remove('urgent-content'),
			e.target.classList.remove('button-urgent-active'),
			e.target.closest('footer').classList.remove('urgent-buttons'))
}

function deleteCard(e) {
	var listIndex = findListIndex(retrieveListId(e, 'article'));
	globalLists.splice(listIndex, 1);
	console.log(globalLists);
	e.target.closest('article').remove();
}

function completeTask(e) {
	var listIndex = findListIndex(retrieveListId(e, 'article'));
	var taskId = retrieveTaskId(e, 'li');

	var taskIndex = globalLists[listIndex].tasksArray.findIndex(function (task) {
		return task.id === parseInt(taskId);
	})

	globalLists[listIndex].tasksArray[taskIndex].complete
		= !globalLists[listIndex].tasksArray[taskIndex].complete;

	console.log(globalLists[listIndex].tasksArray[taskIndex].complete)

	globalLists[listIndex].tasksArray[taskIndex].complete
		? (e.target.closest('li').classList.add('check-task-text'),
			e.target.closest('img').classList.add('check-task-icon'))
		: (e.target.closest('li').classList.remove('check-task-text'),
			e.target.closest('img').classList.remove('check-task-icon'))
}

function deleteHandler(e) {
	var checkArray = [];
	var listIndex = findListIndex(retrieveListId(e, 'article'));
	var tasks = globalLists[listIndex].tasksArray;

	for (var i = 0; i < tasks.length; i++) {
		checkArray.push(tasks[i].complete);
	}
	if (checkArray.includes(false)) {
		console.log('dont delete');
	} else
		deleteCard(e);
}
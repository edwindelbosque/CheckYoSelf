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

var masterArray = [];

cardArea.addEventListener('click', handleCardArea);
navBar.addEventListener('keyup', handleNav);
sideBar.addEventListener('click', handleSideBarButtons);
sideBar.addEventListener('keyup', handleSideBarInputs);
window.addEventListener('DOMContentLoaded', handlePageLoad);

// EVENT DELEGATIONS

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
	}
	else if (e.target.id === 'input-item') {
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

	masterArray = recoveredData;
}

function restoreDOM() {
	for (var i = 0; i < masterArray.length; i++) {
		displayCards(masterArray[i]);
	}
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

function displayTask() {
	listItems.insertAdjacentHTML(
		'beforeend',
		`<li id="task" identifier="${Date.now()}"><img id="button-delete-item" src="images/delete.svg"><p>${document.querySelector('#input-item').value}</p></li>`
	);
	document.querySelector('#input-item').value = '';
	enableAdd();
	enableMakeList();
}

function createToDoList() {
	var toDoList = new ToDoList({
		id: Date.now(),
		title: document.querySelector('#input-title').value,
		tasksArray: addTask(),
		urgent: false
	});

	masterArray.push(toDoList);
	displayCards(toDoList);
	toDoList.saveToStorage(masterArray);
	displaySidebarItems.innerHTML = '';
	inputTitle.value = '';
}

function displayCards(toDoList) {
	var htmlBlock = `      
	<article identifier="${toDoList.id}" ${toDoList.urgent ? 'class="urgent-card"' : ''} >
		<header>
			<h2 contenteditable>${toDoList.title}</h2>
		</header>
		<section class="card-main-section ${toDoList.urgent ? 'urgent-content' : ''}" id="main-content">
			<ul>${pushTasksToDom(toDoList)}</ul >
		</section >
		<footer>
			<button ${toDoList.urgent ? 'class="check-urgent-text"' : ''} id="error-message">
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
			`<li identifier="
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
	var listIndex = findIndex(retrieveId(e, 'article'), masterArray);
	masterArray[listIndex].updateToDo(masterArray);
	var urgentStatus = masterArray[listIndex].urgent;
	styleUrgency(e, urgentStatus);
	deleteAlertMessage();
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

function filterByUrgency() {
	var filterText = document.querySelector('#button-filter');
	document.querySelector('.card-area').innerHTML = '';
	var urgentCards = masterArray.filter(function (list) {
		return list.urgent === true;
	});
	if (filterText.getAttribute('state') === "off") {
		filterText.setAttribute('state', 'on');
		document.querySelector('#button-filter').innerHTML = 'Show All Cards';
		if (!urgentCards.length) {
			document.querySelector('#prioritize')
				? ''
				: document.querySelector('#button-filter').insertAdjacentHTML('afterend', '<p id="prioritize">prioritize some cards!</p>')
		} else {
			for (var i = 0; i < urgentCards.length; i++) {
				displayCards(urgentCards[i]);
				if (document.querySelector('#prioritize')) {
					document.querySelector('#prioritize').remove()
				}
			}
		}
	} else if (filterText.getAttribute('state') === "on") {
		filterText.setAttribute('state', 'off');
		document.querySelector('#input-search').value = '';
		document.querySelector('#button-filter').innerHTML = 'Filter by Urgency';
		if (document.querySelector('#prioritize')) {
			document.querySelector('#prioritize').remove()
		}
		for (var i = 0; i < masterArray.length; i++) {
			displayCards(masterArray[i]);
		}
	}
}

function filterBySearch() {
	var filterText = document.querySelector('#button-filter');
	document.querySelector('.card-area').innerHTML = '';
	var urgentCards = masterArray.filter(function (list) {
		return list.urgent === true;
	});

	var arraySelection = filterText.getAttribute('state') === "on" ? urgentCards : masterArray;

	document.querySelector('.card-area').innerHTML = '';
	var inputSearch = document.querySelector('#input-search').value.toLowerCase();
	var matchingCards = arraySelection.filter(function (list) {
		return list.title.toLowerCase().includes(inputSearch);
	})

	for (var i = 0; i < matchingCards.length; i++) {
		displayCards(matchingCards[i]);
	}
}

function getTasksIntoGlobal() {
	var allTasks = document.querySelectorAll('.task');
	array = [];
	allTasks.forEach(function (li) {
		id = li.id;
		text = li.innerText;
		complete = false;
	});
}

function completeTask(e) { // need to fix this mess
	var listIndex = findIndex(retrieveId(e, 'article'), masterArray);
	var taskId = retrieveId(e, 'li');

	var taskIndex = masterArray[listIndex].tasksArray.findIndex(function (task) {
		return task.id === parseInt(taskId);
	})

	masterArray[listIndex].tasksArray[taskIndex].complete =
		!masterArray[listIndex].tasksArray[taskIndex].complete;

	checkPoint(e);
	styleCompletedTask(e, masterArray[listIndex].tasksArray[taskIndex].complete);
	deleteAlertMessage();
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
	var listIndex = findIndex(retrieveId(e, 'article'), masterArray);
	var tasks = masterArray[listIndex].tasksArray;
	deleteAlertMessage();
	for (var i = 0; i < tasks.length; i++) {
		checkArray.push(tasks[i].complete);
	}

	checkArray.includes(false) ? errorMessage(e) : (deleteCard(e), deleteAlertMessage());
}

function errorMessage(e) {
	e.target.closest('footer').querySelector('#delete-message')
		? ''
		: e.target.closest('footer').querySelector('#error-message').insertAdjacentHTML('afterend', `<p id="delete-message">finish all <br /> tasks first!</p>`)
}

function deleteAlertMessage() {
	var checkMessage = document.querySelector('#delete-message');
	if (checkMessage) {
		checkMessage.remove();
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

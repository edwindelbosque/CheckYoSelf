var globalLists = [];
var globalTasks = [];
var navBar = document.querySelector('nav');
var sideBar = document.querySelector('aside');
var buttonMakeList = document.querySelector('#button-create');
var cardArea = document.querySelector('.card-area');
var displaySidebarItems = document.querySelector('#list-items');
var inputTitle = document.querySelector('#input-title');
var inputTask = document.querySelector('#input-item');
var buttonClear = document.querySelector('#button-clear');
var listItems = document.querySelector('#list-items');

navBar.addEventListener('keyup', handleNav);
sideBar.addEventListener('click', handleSideBarButtons);
sideBar.addEventListener('keyup', handleSideBarInputs);
cardArea.addEventListener('click', handleCardArea);

// repopulateLists();

// function repopulateLists() {
// 	localStorage.getItem(listsArray);
// }

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
		enableButton();
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
	} else if (e.target.id === 'button-filter') {
		console.log('filter!');
	}
}

function handleCardArea(e) {
	e.preventDefault();
	if (e.target.id === 'button-urgent') {
		console.log('urgent!');
	}
	if (e.target.id === 'button-delete-card') {
		console.log('delete!');
	}
}

function addTask() {
	var taskInput = document.querySelector('#input-item').value;
	var task = new Task({ id: Date.now(), text: taskInput, complete: false });

	globalTasks.push(task);
	displayTask(task);
	console.log(globalTasks);
}

function displayTask(object) {
	listItems.insertAdjacentHTML(
		'beforeend',
		`<li><img id="button-delete-item" src="images/delete.svg" data-set="${object.id}">${object.text}</li>`
	);
	document.querySelector('#input-item').value = '';
	enableButton();
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
	console.log(toDoList);
}

function deleteItem(e) {
	if (e.target.id === 'button-delete-item') {
		e.target.parentNode.remove();
	}
}

function clearAll() {
	document.querySelector('#input-item').value = '';
	inputTitle.value = '';
	displaySidebarItems.innerHTML = '';
	enableMakeList();
	enableClear();
}

function displayCards(toDoList, globalTasks) {
	var htmlBlock = `      
	<article>
		<header>
			<h2>${toDoList.title}</h2>
		</header>
		<section class="card-main-section">
			<ul>${pushTasksToDom(globalTasks)}</ul >
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

function pushTasksToDom(globalTasks) {
	var taskList = '';
	for (var i = 0; i < globalTasks.length; i++) {
		taskList +=
			`<li><img src="images/checkbox.svg"><p>${globalTasks[i].text}</p></li>`
	}
	return taskList;
}

function enableClear() {
	inputTitle.value !== '' || displaySidebarItems.innerHTML !== '' || inputTask.value !== ''
		? (buttonClear.disabled = false)
		: (buttonClear.disabled = true);
}

function enableButton() {
	document.querySelector('#button-add').disabled = !document.querySelector('#input-item').value;
}

function enableMakeList() {
	!inputTitle.value || !displaySidebarItems.innerHTML
		? (buttonMakeList.disabled = true)
		: (buttonMakeList.disabled = false);
}
class ToDoList {
	constructor(toDo) {
		this.id = toDo.id;
		this.title = toDo.title;
		this.tasksArray = toDo.tasksArray || [];
		this.urgent = toDo.urgent || false;
		this.complete = toDo.complete || false;
	}

	saveToStorage(listsArray) {
		localStorage.setItem('listsArray', JSON.stringify(listsArray));
	}

	deleteFromStorage() { }

	updateToDo() {
		// title and urgency
	}

	updateTask() {
		// update content
	}
}

class Task {
	constructor(task) {
		this.id = task.id;
		this.text = task.text;
		this.complete = task.complete || false;
	}

	saveToStorage(tasksArray) {

	}
}

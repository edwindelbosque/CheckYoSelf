class ToDoList {
	constructor(toDo) {
		this.id = toDo.id;
		this.title = toDo.title;
		this.tasksArray = toDo.tasksArray || [];
		this.urgent = toDo.urgent || false;
		this.complete = toDo.complete || false;
	}

	saveToStorage(toDosArray) {
		localStorage.setItem('toDosArray', JSON.stringify(toDosArray));
	}

	deleteFromStorage() { }

	updateToDo() {
		// title and urgency
	}

	updateTask() {
		// update content
	}

	pushTask() { }
}

class Task {
	constructor(task) {
		this.id = task.id;
		this.text = task.text;
		this.complete = task.false || false;
	}

	saveToStorage(tasksArray) {
		localStorage.setItem('tasksArray', JSON.stringify(tasksArray));
	}
}

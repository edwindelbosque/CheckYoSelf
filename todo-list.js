class ToDoList {
	constructor(toDo) {
		this.id = toDo.id;
		this.title = toDo.title;
		this.tasksArray = toDo.tasksArray || [];
		this.urgent = toDo.urgent || false;
	}

	saveToStorage(toDosArray) {
		// localStorage.setItem('toDosArray', JSON.stringify(toDosArray));
	}

	deleteFromStorage() {}

	updateToDo() {
		// title and urgency
	}

	updateTask() {
		// update content
	}
}

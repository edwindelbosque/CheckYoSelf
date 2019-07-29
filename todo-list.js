class ToDoList {
	constructor(toDo) {
		this.id = toDo.id;
		this.title = toDo.title;
		this.tasksArray = toDo.tasksArray || [];
		this.urgent = toDo.urgent || false;
	}

	saveToStorage(globalLists) {
		localStorage.setItem("globalStorage", JSON.stringify(globalLists));
	}

	deleteFromStorage() { }

	updateToDo() {
		// title and urgency
	}

	updateTask() {
		// update content
	}
}
class ToDoList {
	constructor(toDo) {
		this.id = toDo.id;
		this.title = toDo.title;
		this.tasksArray = toDo.tasksArray || [];
		this.urgent = toDo.urgent || false;
	}

	saveToStorage(masterArray) {
		localStorage.setItem("globalStorage", JSON.stringify(masterArray));
	}

	deleteFromStorage(masterArray) {
		var listId = this.id;
		var index = masterArray.findIndex(function (list) {
			return parseInt(list.id) === listId;
		});

		masterArray.splice(index, 1);
		this.saveToStorage(masterArray);
	}

	updateToDo(masterArray) {
		// title and urgency
		this.urgent = !this.urgent;
		this.saveToStorage(masterArray);
	}

	updateTask() {
	}
}
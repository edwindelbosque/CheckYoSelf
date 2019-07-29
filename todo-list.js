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

	deleteFromStorage(globalLists) {
		var listId = this.id;
		var index = globalLists.findIndex(function (list) {
			return parseInt(list.id) === listId;
		});

		globalLists.splice(index, 1);
		this.saveToStorage(globalLists);
	}

	updateToDo(globalLists) {
		// title and urgency
		this.urgent = !this.urgent;
		this.saveToStorage(globalLists);
	}

	updateTask() {
		// update content
	}
}

class Task {
	constructor(task) {
		this.id = task.id;
		this.text = task.text;
		this.complete = task.complete;
	}
}
class Task {
  constructor(description) {
    this.description = description;
    this.completed = false;
    this.createTaskElement();
    this.createTaskStatusElement();
    this.createDescriptionElement();
  }

  createTaskElement() {
    this.taskElement = newFromTemplate(document.getElementById("taskTemplate"));
    this.taskElement.addEventListener("click", () => {
      if (this.taskWasSelectedCallback) {
        this.taskWasSelectedCallback(this);
      }
    });
  }

  createTaskStatusElement() {
    this.statusElement = this.taskElement.getElementsByClassName("status")[0];
  }

  createDescriptionElement() {
    this.descriptionElement = this.taskElement.getElementsByClassName("description")[0];
    this.descriptionElement.innerHTML = this.description;
  }

  showStatus() {
    this.hideStatus();
    this.taskElement.innerHTML = `${this.description} ${this.getStatus()}`
    if (this.completed) {
      this.statusElement.classList.add("completed");
    } else {
      this.statusElement.classList.add("incomplete");
    }
  }

  hideStatus() {
    this.taskElement.innerHTML = "";
    this.statusElement.classList.remove("completed");
    this.statusElement.classList.remove("incomplete");
  }

  getStatus() {
    return this.completed ? "completed" : "needs to be done!"
  }

  enableTaskSelection(taskWasSelectedCallback) {
    this.taskWasSelectedCallback = taskWasSelectedCallback;
    this.taskElement.classList.add("selectable");
  }

  cancelTaskSelection() {
    this.taskWasPerformedCallback = null;
    this.taskElement.classList.remove("selectable");
  }

  setPlayer(player) {
    this.player = player;
  }

  sabotage() {
    this.completed = false;
  }

  fix() {
    this.completed = true;
  }

  makeAvailable() {
    this.player = null;
  }

  isAvailable() {
    return this.player == null;
  }

  isBeingPerformedBy(player) {
    return this.player === player;
  }

  isTaskCompleted() {
    return this.completed;
  }

  reset() {
    this.completed = false;
  }
}

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

  updateDescription() {
    if (this.player) {
      this.descriptionElement.innerHTML = `${this.player.name} is performing ${this.description}`;
    } else {
      this.descriptionElement.innerHTML = this.description;
    }
  }

  showPerformingTask() {
    this.updateDescription();
  }

  showCompletionStatus() {
    this.hideCompletionStatus();
    if (this.player) {
      this.descriptionElement.innerHTML = `${this.player.name} ${this.getCompletionStatus()} ${this.description}`;
    } else {
      this.descriptionElement.innerHTML = `${this.description} ${this.getCompletionStatus()}`
    }
    if (this.completed) {
      this.statusElement.classList.add("completed");
    } else {
      this.statusElement.classList.add("incomplete");
    }
  }

  hideCompletionStatus() {
    this.statusElement.classList.remove("completed");
    this.statusElement.classList.remove("incomplete");
  }

  getCompletionStatus() {
    return this.completed ? "completed" : "did not complete"
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
    this.player = null;
    this.hideCompletionStatus();
    this.updateDescription();
  }
}
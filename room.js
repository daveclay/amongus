
/**
 * Imposter's goal:
 * Sabotage the ship by preventing crewmates from doing all tasks
 *
 * Crewmates' goal:
 * Complete all tasks _or_ vote the imposter off the ship
 */
class Room {
  constructor(name, task) {
    this.name = name;
    this.task = task;
    this.players = [];
    this.taskCompleted = false;
    this.createRoomElement();
    this.createPlayersElement();
    this.createTaskElement();
    this.reset();
  }

  createRoomElement() {
    this.roomElement = newFromTemplate(document.getElementById("roomTemplate"));
    this.roomElement.getElementsByClassName("roomName")[0].innerHTML = this.name;
    this.roomElement.addEventListener("click", () => {
      if (this.onRoomSelected) {
        this.onRoomSelected(this);
      }
    })
  }

  createPlayersElement() {
    this.playersElement = this.roomElement.getElementsByClassName("players")[0];
  }

  createTaskElement() {
    this.taskElement = this.roomElement.getElementsByClassName("task")[0];
    this.taskStatusElement = this.roomElement.getElementsByClassName("taskStatus")[0];
  }

  showTaskStatus() {
    this.hideTaskStatus();
    this.taskElement.innerHTML = `${this.task} ${this.getRoomStatus()}`
    if (this.taskCompleted) {
      this.roomElement.classList.add("completed");
      this.taskStatusElement.classList.add("completed");
    } else {
      this.taskStatusElement.classList.add("incomplete");

    }
  }

  hideTaskStatus() {
    this.taskElement.innerHTML = "";
    this.roomElement.classList.remove("completed");
    this.taskStatusElement.classList.remove("completed");
    this.taskStatusElement.classList.remove("incomplete");
  }

  updateTaskStatus() {
    let humanPlayer = this.players.find(player => player.human)
    if (humanPlayer == null) {
      this.hideTaskStatus();
    } else {
      this.showTaskStatus();
    }
  }

  addPlayer(player) {
    this.players[this.players.length] = player;
    this.playersElement.appendChild(player.playerElement);

    if (player.currentRoom) {
      player.currentRoom.removePlayer(player);
      player.currentRoom.updateTaskStatus();
    }

    player.joinedRoom(this);
    this.updateTaskStatus();
  }

  removePlayer(player) {
    let idx = this.players.indexOf(player);
    this.players.splice(idx, 1);
  }

  isOnlyPersonInTheRoom(person) {
    return this.players.length === 1 &&
        this.players[0].name === person.name;
  }

  sabotageTask() {
    this.taskCompleted = false;
  }

  fixTask() {
    this.taskCompleted = true;
  }

  getRoomStatus() {
    return this.taskCompleted ? "completed" : "needs to be done!"
  }

  reset() {
    this.taskCompleted = false;
    this.updateTaskStatus();
  }
}
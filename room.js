
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
  }

  createPlayersElement() {
    this.playersElement = this.roomElement.getElementsByClassName("players")[0];
  }

  createTaskElement() {
    this.taskElement = this.roomElement.getElementsByClassName("task")[0];
  }

  updateTaskStatus() {
    this.taskElement.innerHTML = `${this.task} ${this.getRoomStatus()}`
    this.roomElement.classList.remove("completed");
    if (this.taskCompleted) {
      this.roomElement.classList.add("completed");
    }
  }

  addPlayer(player) {
    this.players[this.players.length] = player;
    this.playersElement.appendChild(player.playerElement);
    player.joinedRoom(this);
  }

  breakTask() {
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
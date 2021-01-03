class Room {
  constructor(name, task) {
    this.name = name;
    this.task = task;
    this.players = [];
    this.createRoomElement();
    this.createPlayersElement();
    this.reset();
  }

  createRoomElement() {
    this.roomElement = newFromTemplate(document.getElementById("roomTemplate"));
    this.roomElement.getElementsByClassName("roomName")[0].innerHTML = this.name;
    this.taskContainer = this.roomElement.getElementsByClassName("taskContainer")[0];
    this.taskContainer.appendChild(this.task.taskElement);
    this.roomElement.addEventListener("click", () => {
      if (this.onRoomSelected) {
        this.onRoomSelected(this);
      }
    })
  }

  createPlayersElement() {
    this.playersElement = this.roomElement.getElementsByClassName("players")[0];
  }

  isHumanInRoom() {
    return this.players.find(player => player.human) != null
  }

  addPlayer(player) {
    if (player.currentRoom) {
      player.currentRoom.removePlayer(player);
    }

    this.players[this.players.length] = player;
    this.playersElement.appendChild(player.playerElement);

    player.joinedRoom(this);
    if (this.playerJoinedRoom) {
      this.playerJoinedRoom(player, this);
    }
  }

  removePlayer(player) {
    let idx = this.players.indexOf(player);
    this.players.splice(idx, 1);
  }

  isOnlyPersonInTheRoom(person) {
    return this.players.length === 1 &&
        this.players[0].name === person.name;
  }

  reset() {
  }
}
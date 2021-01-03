class Game {
  constructor() {
    this.players = [];

    this.playersElement = document.getElementById("players");
    this.playerTemplate = document.getElementById("playerTemplate");
    this.addHumanPlayerButton = document.getElementById("addHumanPlayer");
    this.addComputerPlayerButton = document.getElementById("addComputerPlayer");
    this.playerNameField = document.getElementById("playerName");
    this.startButton = document.getElementById("startButton");
    this.emergencyMeetingButton = document.getElementById("emergencyMeetingButton");
    this.notifyElement = document.getElementById("notify");
    this.roomsElement = document.getElementById("rooms");

    this.rooms = [
      new Room("Cafeteria", "Fix wiring"),
      new Room("Reactor", "Unlock manifolds"),
      new Room("Admin", "Swipe card"),
      new Room("Navigation", "Stabilize steering"),
      new Room("Weapons", "Destroy asteroids"),
      new Room("Engine", "Fill the fuel tank")
    ]
    this.cafeteria = this.rooms.find(room => room.name === "Cafeteria");

    this.rooms.forEach(room => {
      room.playerJoinedRoom = () => {
        // TODO: not needed?
      }
    });

    const newPlayerElement = () => {
      return newFromTemplate(this.playerTemplate);
    };

    const addPlayer = (name, playerCreated) => {
      let player = new Player();
      player.name = name;
      player.onVotedAsImposter(player => {
        this.handleVotedForPlayer(player);
      });
      playerCreated(player);

      let playerElement = newPlayerElement();
      player.setPlayerElement(playerElement);
      this.playersElement.appendChild(playerElement);

      this.addPlayer(player);
    };

    const addHumanPlayer = () => {
      addPlayer(this.playerNameField.value, player => {
        this.playerNameField.value = "";
      });
    };

    this.playerNameField.addEventListener("keyup", (event) => {
      if ("Enter" === event.code) {
        addHumanPlayer();
      }
    });

    this.addHumanPlayerButton.addEventListener("click", () => addHumanPlayer());

    this.addComputerPlayerButton.addEventListener("click", () => {
      if (availableComputerPlayers.length === 0) {
        alert("Sorry, there are no more available players.");
        return;
      }
      addPlayer(pluckRandom(availableComputerPlayers), player => {
        player.human = false;
      })
    });

    this.startButton.addEventListener("click", () => {
      this.startButton.innerHTML = "New Game";
      this.resetGame();
      this.nextPlayerTurn();
    });

    this.emergencyMeetingButton.addEventListener("click", () =>  {
      this.disableEmergencyMeetingButton();
      document.getElementsByTagName("body")[0].classList.add("voting");
      game.startVotePhase();
    });

    this.rooms.forEach(room => {
      this.roomsElement.appendChild(room.roomElement);
    })
  }

  enableEmergencyMeetingButton() {
    this.emergencyMeetingButton.disabled = false;
    this.emergencyMeetingButton.classList.add("enabled");
  }

  disableEmergencyMeetingButton() {
    this.emergencyMeetingButton.disabled = true;
    this.emergencyMeetingButton.classList.remove("enabled");
  }

  nextPlayerTurn() {
    if (this.currentTurnPlayer) {
      this.currentTurnPlayer.playerTurnDone();
    }
    this.currentTurnPlayerIndex += 1;
    if (this.currentTurnPlayerIndex === this.players.length) {
      this.currentTurnPlayerIndex = 0;
    }
    this.currentTurnPlayer = this.players[this.currentTurnPlayerIndex];
    this.currentTurnPlayer.startPlayerTurn();

    setTimeout(() => {
      if (this.currentTurnPlayer.human) {
        if (this.currentTurnPlayer.currentRoom === this.cafeteria) {
          this.enableEmergencyMeetingButton();
        }

        this.startRoomSelection(() => {
          this.disableEmergencyMeetingButton();
          this.currentPlayerPerformsTask(() => {
            this.nextPlayerTurn();
          });
        });
      } else {
        this.disableEmergencyMeetingButton();
        let room = sample(this.rooms);
        room.addPlayer(this.currentTurnPlayer);
        this.currentPlayerPerformsTask(() => {
          this.nextPlayerTurn();
        })
      }
    }, 1000);
  }

  currentPlayerPerformsTask(callback) {
    setTimeout(() => {
      this.currentTurnPlayer.performTask();
      if  (this.currentTurnPlayer.human) {
        this.currentTurnPlayer.currentRoom.showTaskStatus();
      }
      callback();
    }, 1000);
  }

  startRoomSelection(callback) {
    this.rooms.forEach(room => {
      room.onRoomSelected = (room) => {
        this.currentTurnPlayer.currentRoom.hideTaskStatus();
        room.addPlayer(this.currentTurnPlayer);
        this.cancelRoomSelection();
        callback();
      }
    });
  }

  cancelRoomSelection() {
    this.rooms.forEach(room => {
      room.onRoomSelected = null;
    });
  }

  notify(message) {
    if (this.notifyTimeout) {
      clearTimeout(this.notifyTimeout);
    }
    this.notifyElement.innerHTML = message;
    this.notifyTimeout = setTimeout(() => {
      this.notifyElement.innerHTML = "";
    }, 5000);
  }

  addPlayer(player) {
    player.index = this.players.length
    this.players[this.players.length] = player;
  };

  resetPlayers() {
    this.players.forEach(player => player.reset());
  }

  resetRooms() {
    this.rooms.forEach(room => room.reset());
  }

  isAllRoomTasksCompleted() {
    let incompleteRoom = this.rooms.find(room => !room.taskCompleted);
    return incompleteRoom == null;
  }

  /**********************************
   * Start/Reset Game
   **********************************/
  resetGame() {
    this.currentVotingPlayerIndex = -1;
    this.currentTurnPlayerIndex = -1;
    this.resetPlayers();
    this.resetRooms();
    this.pickImposter();
    this.everyoneInCafeteria();
  }

  pickImposter() {
    let imposter = sample(this.players);
    imposter.imposter = true;
  };

  everyoneInCafeteria() {
    this.players.forEach(player => {
      this.cafeteria.addPlayer(player);
    });
  }

  /**********************************
   * Voting Phase
   **********************************/

  startVotePhase() {
    this.currentVotingPlayerIndex = -1;
    this.cancelRoomSelection();
    this.nextVoteTurn();
  }

  endVotePhase() {
    this.hideAllVoteButtons();
    this.tallyVotes();

    this.players.forEach(player => player.show());
  }

  tallyVotes() {
    function sortByVote(a, b) {
      return a.voteCount > b.voteCount ? -1 : 1;
    }

    let sortedPlayers = this.players.slice().sort(sortByVote);
    let mostVotedPlayer = sortedPlayers[0];
    let secondMostVotedPlayer = sortedPlayers[1];

    if (mostVotedPlayer.voteCount === secondMostVotedPlayer.voteCount) {
      this.notify("No one was ejected. (Tie!)");
    } else if (mostVotedPlayer.imposter) {
      this.notify(`Victory! ${mostVotedPlayer.name} was the imposter!`);
    } else {
      this.notify(`${mostVotedPlayer.name} was NOT the imposter!`);
    }
  }

  hideAllVoteButtons() {
    this.players.forEach(player => {
      player.hideVoteButton();
    });
  }

  showVoteButtonsForOtherPlayers() {
    this.players.forEach(player => {
      if (player !== this.currentVotingPlayer) {
        player.showVoteButton();
      } else {
        player.hideVoteButton();
      }
    });
  }

  nextVoteTurn() {
    this.nextVotingPlayer();
    if (this.currentVotingPlayerIndex === this.players.length) {
      this.endVotePhase();
    } else {
      this.showVoteButtonsForOtherPlayers();
      this.currentVotingPlayer.startVoteTurn();
    }
  }

  handleVotedForPlayer(player) {
    this.currentVotingPlayer.voteTurnDone();
    this.nextVoteTurn();
  }

  nextVotingPlayer() {
    this.currentVotingPlayerIndex += 1;
    this.currentVotingPlayer = this.players[this.currentVotingPlayerIndex];
  }
}

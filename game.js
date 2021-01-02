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
      new Room("Reactor", "Unlock manifolds"),
      new Room("Cafeteria", "Fix wiring"),
      new Room("Admin", "Swipe card"),
      new Room("Navigation", "Stabilize steering"),
      new Room("Weapons", "Destroy asteroids"),
      new Room("Engine", "Fill the fuel tank")
    ]

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

    this.addHumanPlayerButton.addEventListener("click", () => {
      addPlayer(this.playerNameField.value, player => {
        this.playerNameField.value = "";
      });
    });

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
      this.resetGame();
    });

    this.emergencyMeetingButton.addEventListener("click", () =>  {
      this.emergencyMeetingButton.disabled = true;
      game.startVotePhase();
    });

    this.rooms.forEach(room => {
      this.roomsElement.appendChild(room.roomElement);
    })
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
    this.resetPlayers();
    this.resetRooms();
    this.pickImposter();
    this.startButton.disabled = true;
    this.emergencyMeetingButton.disabled = false;
    this.startRoomPhase();
  }

  pickImposter() {
    let imposter = sample(this.players);
    imposter.imposter = true;
  };

  /**********************************
   * Room Phase
   **********************************/

  updateRoomsTaskStatus() {
    this.rooms.forEach(room => room.updateTaskStatus());
  }

  startRoomPhase() {
    this.notify("Starting Room Phase! Players heading to rooms...");
    this.updateRoomsTaskStatus();
    /**
     * The crew go to a room and perform the task
     * The imposters goes to locations to sabotage them by not doing the task
     * the crew has to figure out that something they fixed is now broken vs just broken?
     *
     * TODO: Only call emergency meeting if you're in the cafeteria?
     */
    this.sendPlayersToRooms();
    this.endRoomPhase();
  }

  sendPlayersToRooms() {
    this.players.forEach(player => {
      let room = sample(this.rooms);
      room.addPlayer(player);
    })
  }

  endRoomPhase() {
    setTimeout(() => {
      this.startTaskPhase();
    }, END_ROOM_PHASE_TIMEOUT);
  }

  /**********************************
   * Task Phase
   **********************************/

  startTaskPhase() {
    this.notify("Starting Task Phase! Players are performing tasks... or NOT!");
    this.players.forEach(player => {
      player.performTask();
    });
    this.endTaskPhase();
  }

  endTaskPhase() {
    if (this.isAllRoomTasksCompleted()) {
      this.updateRoomsTaskStatus();
      this.notify("Crewmates Win!");
      this.startButton.disabled = false;
      return;
    }
    // TODO: next button?
    setTimeout(() => {
      this.startRoomPhase();
    }, END_TASK_PHASE_TIMEOUT);
  }

  /**********************************
   * Voting Phase
   **********************************/

  startVotePhase() {
    this.currentVotingPlayerIndex = -1;
    this.nextVoteTurn();
  }

  endVotePhase() {
    this.hideAllVoteButtons();
    this.tallyVotes();

    this.players.forEach(player => player.show());

    setTimeout(() => {
      this.startRoomPhase();
    }, END_VOTE_PHASE_TIMEOUT)
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

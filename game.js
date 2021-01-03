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
    this.bodyElement = document.getElementsByTagName("body")[0]

    let fixWiring = new Task("Fix wiring");
    let unlockManifolds = new Task("Unlock manifolds");
    let swipeCard = new Task("Swipe card");
    let stabilizeSteering = new Task("Stabilize steering");
    let destroyAsteroids = new Task("Destroy asteroids");
    let fillFuel = new Task("Fill the fuel tank");
    this.tasks = [
        fixWiring,
        unlockManifolds,
        swipeCard,
        stabilizeSteering,
        destroyAsteroids,
        fillFuel
    ];

    this.cafeteria = new Room("Cafeteria", fixWiring);
    let reactor = new Room("Reactor", unlockManifolds);
    let admin = new Room("Admin", swipeCard);
    let navigation = new Room("Navigation", stabilizeSteering);
    let weapons = new Room("Weapons", destroyAsteroids);
    let engine = new Room("Engine", fillFuel);

    this.rooms = [
        this.cafeteria,
        reactor,
        admin,
        navigation,
        weapons,
        engine
    ];

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
      player.onVoted(() => {
        this.currentVotingPlayer.voteTurnDone();
        this.nextVoteTurn();
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
      this.bodyElement.classList.add("voting");
      game.startVotePhase();
    });

    this.rooms.forEach(room => {
      this.roomsElement.appendChild(room.roomElement);
    })
  }

  victory(msg) {
    this.notify(msg, false);
    this.bodyElement.classList.add("victory");
  }

  clearBody() {
    this.bodyElement.classList.remove("victory");
    this.bodyElement.classList.remove("voting");
  }

  enableEmergencyMeetingButton() {
    this.emergencyMeetingButton.disabled = false;
    this.emergencyMeetingButton.classList.add("enabled");
  }

  disableEmergencyMeetingButton() {
    this.emergencyMeetingButton.disabled = true;
    this.emergencyMeetingButton.classList.remove("enabled");
  }

  getCurrentTurnPlayerRoom() {
    return this.currentTurnPlayer.currentRoom;
  }

  getCurrentTurnPlayerRoomTask() {
    return this.getCurrentTurnPlayerRoom().task;
  }

  cancelTaskSelection() {
    this.tasks.forEach(task => {
      task.cancelTaskSelection();
    });
  }

  cancelCurrentPlayerSelections() {
    this.disableEmergencyMeetingButton();
    this.cancelTaskSelection();
    this.cancelRoomSelection();
  }

  nextPlayerTurn() {
    if (this.currentTurnPlayer) {
      this.currentTurnPlayer.playerTurnDone();
      this.cancelCurrentPlayerSelections();
    }
    this.currentTurnPlayerIndex += 1;
    if (this.currentTurnPlayerIndex === this.players.length) {
      this.currentTurnPlayerIndex = 0;
    }
    this.currentTurnPlayer = this.players[this.currentTurnPlayerIndex];
    this.currentTurnPlayer.startPlayerTurn();
    this.notify(`${this.currentTurnPlayer.name}'s turn`, false);

    if (this.currentTurnPlayer.human) {
      if (this.currentTurnPlayer.currentRoom === this.cafeteria) {
        this.enableEmergencyMeetingButton();
      }

      if (this.getCurrentTurnPlayerRoomTask().isBeingPerformedBy(this.currentTurnPlayer)) {
        this.currentTurnPlayer.finishTask();
      }

      // TODO: do this when the task is _completed_? IF there's victory, the rest of this method shouldn't run.
      this.checkAllTasksForVictory();

      // Turn Option 1: Perform Task if it's available
      if (this.getCurrentTurnPlayerRoomTask().isAvailable()) {
        this.getCurrentTurnPlayerRoomTask().enableTaskSelection(() => {
          this.currentPlayerPerformTask();
        });
      }

      // Turn Option 2: Move to another Room
      this.startRoomSelection(room => {
        room.addPlayer(this.currentTurnPlayer);
        this.nextPlayerTurn();
      });
    } else {
      setTimeout(() => {
        if (this.getCurrentTurnPlayerRoomTask().isAvailable()) {
          this.currentPlayerPerformTask();
        } else {
          let room = sample(this.rooms);
          room.addPlayer(this.currentTurnPlayer);
          this.nextPlayerTurn();
        }
      }, 1000);
    }
  }

  getImposter() {
    return this.players.find(player => player.imposter);
  }

  currentPlayerPerformTask() {
    this.currentTurnPlayer.startTask();
    this.nextPlayerTurn();
  }

  checkAllTasksForVictory() {
    if (this.isAllTasksCompleted()) {
      let imposter = this.getImposter();
      imposter.setStatus(imposterStatus);
      this.victory(`All tasks completed! ${imposter.name} was the imposter!`);
    } else {
      // TODO: what's the imposter's goal?
    }
  }

  isAllTasksCompleted() {
    return this.tasks.find(task => !task.isTaskCompleted()) == null;
  }

  startRoomSelection(roomWasSelectedCallback) {
    this.rooms.forEach(room => {
      room.onRoomSelected = (room) => {
        roomWasSelectedCallback(room);
      }
    });
  }

  cancelRoomSelection() {
    this.rooms.forEach(room => {
      room.onRoomSelected = null;
    });
  }

  notify(message, clearAfterTimeout) {
    if (this.notifyTimeout) {
      clearTimeout(this.notifyTimeout);
    }
    this.notifyElement.innerHTML = message;
    this.notifyElement.classList.remove("hidden");
    if (clearAfterTimeout) {
      this.clearNotify();
    }
  }

  clearNotify() {
    this.notifyTimeout = setTimeout(() => {
      this.notifyElement.innerHTML = "";
      this.notifyElement.classList.add("hidden");
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

  /**********************************
   * Start/Reset Game
   **********************************/
  resetGame() {
    this.clearNotify();
    this.clearBody();
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
    this.clearNotify();
    this.currentVotingPlayerIndex = -1;
    this.cancelRoomSelection();
    this.nextVoteTurn();
  }

  endVotePhase() {
    this.bodyElement.classList.remove("voting");
    this.clearNotify();
    this.hideAllVoteButtons();
    this.tallyVotes();
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
      this.victory(`Victory! ${mostVotedPlayer.name} was the imposter!`, false);
      return;
    } else {
      this.notify(`${mostVotedPlayer.name} was NOT the imposter!`);
    }

    this.nextPlayerTurn();
  }

  hideAllVoteButtons() {
    this.players.forEach(player => {
      player.hideVoteButton();
      player.hideSkipButton();
    });
  }

  showVoteButtons() {
    this.players.forEach(player => {
      if (player !== this.currentVotingPlayer) {
        player.showVoteButton();
      } else {
        player.showSkipButton();
      }
    });
  }

  nextVoteTurn() {
    this.nextVotingPlayer();
    if (this.currentVotingPlayerIndex === this.players.length) {
      this.endVotePhase();
    } else {
      this.notify(`${this.currentTurnPlayer.name}'s turn to vote`, false);
      if  (this.currentVotingPlayer.human) {
        this.showVoteButtons();
        this.currentVotingPlayer.startVoteTurn();
      } else {
        this.hideAllVoteButtons();

        this.currentVotingPlayer.showVotingStatus();
        setTimeout(() => {
          // TODO: based on rooms they've seen others in
          let others = this.getOtherPlayers(this.currentVotingPlayer);
          let imposterGuess = sample(others);
          imposterGuess.voteImposter();
        }, 1000);
      }
    }
  }

  getOtherPlayers(player) {
    return allExcept(this.players, player);
  }

  nextVotingPlayer() {
    this.currentVotingPlayerIndex += 1;
    this.currentVotingPlayer = this.players[this.currentVotingPlayerIndex];
  }
}

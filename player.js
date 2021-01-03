class PlayerStatus {
  constructor(styleClass, textCallback) {
    this.textCallback = textCallback
    this.styleClass = styleClass;
  }

  apply(player) {
    player.statusElement.innerHTML = this.textCallback(player);
    player.playerElement.classList.add(this.styleClass);
  }

  unapply(player) {
    player.statusElement.innerHTML = "";
    player.playerElement.classList.remove(this.styleClass);
  }
}

const turnStatus = new PlayerStatus(
    "turnHighlight",
    player => `${player.name}'s turn!`);

const votingStatus = new PlayerStatus(
    "votingHighlight",
    player => `${player.name}'s turn to vote!`);

const imposterStatus = new PlayerStatus(
"imposterHighlight",
    player => `${player.name} is the imposter!`);

const crewmateStatus = new PlayerStatus(
    "crewmateHighlight",
    player => `${player.name} is a crewmate`);


class Player {
  constructor() {
    this.imposter = false;
    this.human = true;
    this.showing = false;
    this.image = pluckRandom(availableImages);
    this.voteCount = 0;
  };

  createPlayerImage() {
    this.imageElement = document.getElementById(this.image + "Image");
    this.playerElement.getElementsByClassName("imageContainer")[0].appendChild(this.imageElement);
    this.imageElement.addEventListener("click", () => {
      this.show();
    });
  }

  createVoteButton() {
    this.voteButton = this.playerElement.getElementsByClassName("voteButton")[0];
    this.voteButton.addEventListener("click", () => this.voteImposter());
  }

  createSkipButton() {
    this.skipButton = this.playerElement.getElementsByClassName("skipButton")[0];
    this.skipButton.addEventListener("click", () => this.handleSkipClicked());
  }

  createStatusElement() {
    this.statusElement = this.playerElement.getElementsByClassName("status")[0];
  }

  setPlayerElement(playerElement) {
    this.playerElement = playerElement;
    this.playerElement.getElementsByClassName("playerName")[0].innerHTML = this.name;
    this.createPlayerImage();
    this.createStatusElement();
    this.createVoteButton();
    this.createSkipButton();
  };

  voteImposter() {
    this.voteCount += 1;
    this.votedCallback(this);
  }

  handleSkipClicked() {
    this.votedCallback(this);
  }

  setStatus(status) {
    this.currentStatus = status;
    status.apply(this);
  }

  clearStatus() {
    if (this.currentStatus) {
      this.currentStatus.unapply(this);
      this.currentStatus = null;
    }
  }

  showImposterStatus() {
    this.showing = true;
    if (this.imposter) {
      this.setStatus(imposterStatus);
    } else {
      this.setStatus(crewmateStatus);
    }
  }

  hideImposterStatus() {
    this.clearStatus();
    this.showing = false;
  }

  show() {
    if (this.showing) {
      return;
    }
    this.showImposterStatus();
    setTimeout(() => {
      this.hideImposterStatus();
    }, 5000);
  };

  onVoted(callback) {
    this.votedCallback = callback;
  }

  showVoteButton() {
    this.voteButton.classList.remove("hidden");
    this.hideSkipButton();
  }

  hideVoteButton() {
    this.voteButton.classList.add("hidden");
  }

  showSkipButton() {
    this.skipButton.classList.remove("hidden");
    this.hideVoteButton();
  }

  hideSkipButton() {
    this.skipButton.classList.add("hidden");
  }

  voteTurnDone() {
    this.clearStatus();
    this.hideSkipButton();
  }

  startVoteTurn() {
    this.setStatus(votingStatus);
    if (this.human) {
      this.showSkipButton();
    }
  }

  startPlayerTurn() {
    this.setStatus(turnStatus);
  }

  playerTurnDone() {
    this.clearStatus();
  }

  reset() {
    this.clearStatus();
    this.imposter = false;
    this.voteCount = 0;
  }

  joinedRoom(room) {
    this.currentRoom = room;
  }

  performTask() {
    if (this.currentRoom == null) {
      alert(`${this.name} is not in a room! That's a bug, daddy!`);
      return;
    }

    if (this.imposter) {
        if (this.currentRoom.isOnlyPersonInTheRoom(this)) {
          this.currentRoom.sabotageTask();
        }
    } else {
      this.currentRoom.fixTask();
    }
  }
}

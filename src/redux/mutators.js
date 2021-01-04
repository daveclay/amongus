import {
  ArrayUtils
} from "../utils";
import {
  getCurrentTurnPlayer, getRoomForPlayer,
  getRoomByName, getTaskById, isPlayerPerformingTask, isImposter, isOnlyPlayerInRoom
} from "../selectors/selectors";

/************************************************
 * Mutators
 ************************************************/
export const resetGame = state => {
  state.gameOver = false
  state.victory = false
}
export const addPlayer = (state, action) => {
  if (state.addPlayerForm.name.length === 0)  {
    return state;
  }
  let player = {
    ...action.player,
    name: state.addPlayerForm.name,
    image: ArrayUtils.pluckRandom(state.availablePlayerImages),
  }
  state.players[state.players.length] = player
  movePlayerToRoom(state, player, "Cafeteria")
  state.addPlayerForm.name = ""
}

export const movePlayersToCafeteria = state => {
  state.rooms.forEach(room => room.playerNames = []);
  state.players.forEach(player => movePlayerToRoom(state, player, "Cafeteria"))
}

export const movePlayerToRoom = (state, player, roomName) => {
  leaveCurrentRoom(state, player.name)
  let newRoom = getRoomByName(state, roomName);
  newRoom.playerNames[newRoom.playerNames.length] = player.name
}

export const moveCurrentPlayerToRoom = (state, roomName) => {
  let currentTurnPlayer = getCurrentTurnPlayer(state)
  if (currentTurnPlayer) {
    movePlayerToRoom(state, currentTurnPlayer, roomName)
  }
}

export const leaveCurrentRoom = (state, playerNameToRemove) => {
  state.rooms.forEach(room => {
    room.playerNames = ArrayUtils.allExcept(room.playerNames, playerNameToRemove);
  })
}

export const assignPlayerToTask = (state, taskId) => {
  let currentTurnPlayer = getCurrentTurnPlayer(state)
  let currentTurnPlayerRoom = getRoomForPlayer(state, currentTurnPlayer)
  if (taskId === currentTurnPlayerRoom.taskId) {
    let task = getTaskById(state, taskId)
    task.playerName = currentTurnPlayer.name
  }
}

export const finishCurrentTurnPlayerTask = state => {
  let currentTurnPlayer = getCurrentTurnPlayer(state)
  let room = getRoomForPlayer(state, currentTurnPlayer)
  let task = getTaskById(state, room.taskId)
  if (isPlayerPerformingTask(currentTurnPlayer, task)) {
    if (isImposter(state, currentTurnPlayer)) {
      if (isOnlyPlayerInRoom(room, currentTurnPlayer)) {
        console.log(`${currentTurnPlayer.name} sabotaged ${task.description}`)
        task.completed = false
      } else {
        // TODO: don't _always_ complete it
        task.compelted = true
      }
    } else {
      // TODO: don't _always_ complete it
      task.completed = true
    }

    task.playerName = null
  }
}

const abandonAllTasks = state => {
  state.tasks.forEach(task => task.playerName = null)
}

export const startEmergencyMeeting = state => {
  movePlayersToCafeteria(state)
  abandonAllTasks(state)
  state.emergencyMeetingStarted = true
  state.emergencyMeetingInitiatedByPlayerIndex = state.currentTurnPlayerIndex
  resetVoteTallies(state)
  state.notify = {
    message: "Emergency Meeting!",
    className: "emergencyMeeting"
  }
}

const resetVoteTallies = state => {
  state.players.forEach(player => state.voteTalliesByPlayer[player.name] = 0)
}

export const voteImposter = (state, playerName) => {
  state.voteTalliesByPlayer[playerName] += 1
}



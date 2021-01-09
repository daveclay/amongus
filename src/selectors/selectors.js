/************************************************
 * Selectors
 ************************************************/
export const getPlayersInRoom = (players, room) => room.playerNames.map(name => getPlayerByName(players, name))
export const getPlayerByName = (players, name) => players.find(player => player.name === name)
export const getCurrentTurnPlayer = (state) => state.players[state.currentTurnPlayerIndex]
export const getCurrentTurnPlayerName = (state) => {
  let currentTurnPlayer = getCurrentTurnPlayer(state)
  if (currentTurnPlayer) {
    return currentTurnPlayer.name
  } else {
    return null;
  }
}
export const isCurrentTurnPlayer = (state, player) => getCurrentTurnPlayerName(state) === player.name
export const getRoomForPlayer = (state, player) => {
  return state.rooms.find(room => isPlayerInRoom(room, player))
}
export const isPlayerInRoom = (room, player) => room.playerNames.includes(player.name)
export const isCurrentTurnPlayerInRoom = (state, room) => {
  let currentTurnPlayer = getCurrentTurnPlayer(state)
  if (currentTurnPlayer) {
    let currentTurnPlayerRoom = getRoomForPlayer(state, currentTurnPlayer)
    return currentTurnPlayerRoom && currentTurnPlayerRoom.name === room.name
  } else {
    return false
  }
}
export const isCurrentTurnPlayerAbleToSelectRoom = (state, room) => {
  let currentTurnPlayer = getCurrentTurnPlayer(state);
  return currentTurnPlayer &&
      !isCurrentTurnPlayerInRoom(state, room) &&
      !state.gameOver &&
      !state.emergencyMeetingStarted &&
      currentTurnPlayer.human
}
export const isEmergencyButtonEnabled = state => {
  let currentTurnPlayer = getCurrentTurnPlayer(state);
  if (currentTurnPlayer) {
    let room = getRoomForPlayer(state, currentTurnPlayer)
    return currentTurnPlayer &&
        currentTurnPlayer.human &&
        !state.gameOver &&
        room.emergencyButton
  } else {
    return false
  }
}
export const getTaskForRoom = (state, room) => state.tasks.find(task => task.id === room.taskId)
export const getTaskById = (state, id) => state.tasks.find(task => task.id === id)
export const isCurrentTurnPlayerAbleToSelectTask = (state, task) => {
  let room = getRoomForTask(state, task)
  return isCurrentTurnPlayerInRoom(state, room) &&
      task.playerName == null &&
      !state.emergencyMeetingStarted &&
      !task.completed &&
      getCurrentTurnPlayer(state).human
}
export const isPlayerPerformingTask = (player, task) => task.playerName === player.name
export const isCurrentTurnPlayerHumanAndInRoom = (state, room) => {
  return isCurrentTurnPlayerInRoom(state, room) && getCurrentTurnPlayer(state).human
}
export const isImposter = (state, player) => state.imposterPlayerName === player.name
export const isOnlyPlayerInRoom = (room, player) => room.playerNames.length === 1 && room.playerNames[0] === player.name
export const getRoomForTask = (state, task) => state.rooms.find(room => room.taskId === task.id)
export const getRoomByName = (state, roomName) => state.rooms.find(room => room.name === roomName)
export const getNextPlayerTurnIndex = (state) => {
  let nextIndex = state.currentTurnPlayerIndex + 1
  if (state.players.length === nextIndex) {
    return 0;
  } else {
    return nextIndex;
  }
}
export const isAllTasksComplete = state => state.tasks.filter(task => !task.completed).length === 0

export const isEmergencyMeetingFinished = state => {
  if (!state.emergencyMeetingStarted) {
    return
  }
  let lastVotingPlayerIndex = state.emergencyMeetingInitiatedByPlayerIndex - 1
  if (lastVotingPlayerIndex < 0) {
    lastVotingPlayerIndex = state.players.length - 1
  }
  return state.currentTurnPlayerIndex === lastVotingPlayerIndex
}

const sortByVote = (a, b) => a[1] > b[1] ? -1 : 1

export const getEmergencyMeetingVoteResults = state => {
  const sortedTallies = Object.entries(state.voteTalliesByPlayer).sort(sortByVote)
  const mostVotedPlayerTally = sortedTallies[0]
  const secondMostVotedPlayerTally = sortedTallies[1]

  const mostVoted = {
    playerName: mostVotedPlayerTally[0],
    votes: mostVotedPlayerTally[1]
  }

  const secondMostVoted = {
    playerName: secondMostVotedPlayerTally[0],
    votes: secondMostVotedPlayerTally[1]
  }

  const buildResult = results => ({
    mostVoted,
    secondMostVoted,
    results
  })

  if (mostVoted.votes === secondMostVoted.votes) {
    return buildResult({
      victory: false,
      tie: true
    })
  } else if (mostVoted.playerName === state.imposterPlayerName) {
    return buildResult({
      victory: true
    })
  } else {
    return buildResult({
      victory: false
    })
  }
}

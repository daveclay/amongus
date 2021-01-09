import {
  getCurrentTurnPlayer,
  getEmergencyMeetingVoteResults,
  getRoomForPlayer,
  getTaskForRoom,
  isAllTasksComplete,
  isEmergencyMeetingFinished
} from "../selectors/selectors";
import {ArrayUtils} from "../utils";

export const init = () => ({
  type: 'init'
})
export const updatePlayerName = (name) => ({
  type: 'updatePlayerName',
  name: name
})

export const addHumanPlayer = () => ({
  type: 'addHumanPlayer',
  player: {
    human: true
  }
})

export const addComputerPlayer = () => ({
  type: 'addComputerPlayer',
  player: {
    human: false
  }
})
export const nextPlayerTurn = () => ({
  type: 'nextPlayerTurn'
})
export const startGame = () => (dispatch, getState) => {
  dispatch({
    type: 'startGame'
  })
  dispatchNextTurn(dispatch, getState)
}
export const enableComputerPlayers = () => ({
  type: 'enableComputerPlayers'
})
export const onRoomSelected = (roomName) => (dispatch, getState) => {
  dispatch({
    type: 'onRoomSelected',
    roomName
  })
  dispatchNextTurn(dispatch, getState)
}
export const onTaskSelected = (taskId) => (dispatch, getState) => {
  dispatch({
    type: 'onTaskSelected',
    taskId
  })
  dispatchNextTurn(dispatch, getState)
}
export const onEmergencyMeetingSelected = () => ({
  type: 'onEmergencyMeetingSelected'
})

export const skipVote = () => (dispatch, getState) => {
  dispatchNextTurn(dispatch, getState)
}

export const voteImposter = (playerName) => (dispatch, getState) => {
  dispatch({
    type: 'voteImposter',
    playerName
  })
  dispatchNextTurn(dispatch, getState)
}

export const votedOffImposter = (voteResults) => ({
  type: 'votedOffImposter',
  voteResults
})

export const votedTie = (voteResults) => ({
  type: 'votedTie',
  voteResults
})

export const voteFailed = (voteResults) => ({
  type: 'voteFailed',
  voteResults
})

export const emergencyMeetingFinished = () => ({
  type: 'emergencyMeetingFinished'
})

export const allTasksCompleted = () => ({
  type: 'allTasksCompleted'
})

/************************************************
 * Helpers/Shared Actions
 ************************************************/
const dispatchNextTurn = (dispatch, getState) => {
  const continueGamePromise = new Promise(continueGame => {
    if (isEmergencyMeetingFinished(getState())) {
      const voteResults = getEmergencyMeetingVoteResults(getState())
      if (voteResults.results.victory) {
        dispatch(votedOffImposter(voteResults))
      } else {
        if (voteResults.results.tie) {
          dispatch(votedTie(voteResults))
        } else {
          dispatch(voteFailed(voteResults))
        }
        // Give time for the players to see the results of the vote before continuing on
        setTimeout(() => continueGame(), 3000)
      }
      dispatch(emergencyMeetingFinished())
    } else if (isAllTasksComplete(getState())) {
      dispatch(allTasksCompleted())
    } else {
      // just another turn - continue on immediately
      continueGame()
    }
  })

  continueGamePromise.then(() => {
    dispatch(nextPlayerTurn())
    let state = getState()
    let player = getCurrentTurnPlayer(state)
    if (!player.human && state.computerPlayersEnabled) {
      doComputerPlayer(dispatch, getState)
    }
  })
}

const doComputerPlayer = (dispatch, getState) => {
  setTimeout(() => {
    let action = ArrayUtils.sample(getAvailableComputerActions(getState))
    dispatch(action)
  }, 200)
}

const getAvailableComputerActions = (getState) => {
  const state = getState()
  if (state.emergencyMeetingStarted) {
    return [computerPlayerVote]
  } else {
    return computerActions
  }
}

const computerPlayerVote = (dispatch, getState) => {
  const state = getState()
  // TODO: make a better guess
  if (Math.random() > .5) {
    dispatch(voteImposter(ArrayUtils.sample(state.players).name))
  } else {
    dispatch(skipVote())
  }
}

const moveToRandomRoom = (dispatch, getState) => {
  let state = getState()
  let randomRoom = ArrayUtils.sample(state.rooms)
  dispatch(onRoomSelected(randomRoom.name))
}

const performCurrentRoomTask = (dispatch, getState) => {
  let state = getState()
  let currentPlayer = getCurrentTurnPlayer(state)
  let room = getRoomForPlayer(state, currentPlayer)
  let task = getTaskForRoom(state, room)
  dispatch(onTaskSelected(task.id))
}

const computerActions = [
  moveToRandomRoom,
  performCurrentRoomTask
]


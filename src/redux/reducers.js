import * as actions from "./actions"
import { map, reducer } from "./utils/redux-map";
import { mutatorToReducer, ArrayUtils, reduceAll } from "../utils";
import {
  addPlayer as addPlayerMutator,
  startEmergencyMeeting as startEmergencyMeetingMutator,
  voteImposter as voteImposterMutator,
  assignPlayerToTask, finishCurrentTurnPlayerTask,
  moveCurrentPlayerToRoom,
  movePlayersToCafeteria,
} from "./mutators"
import {
  getCurrentTurnPlayerName,
  getNextPlayerTurnIndex
} from "../selectors/selectors"

export const initialState = {
  gameOver: false,
  notify: {
    message: null
  },
  computerPlayersEnabled: false,
  currentTurnPlayerIndex: -1,
  emergencyMeetingStarted: false,
  emergencyMeetingInitiatedByPlayerIndex: null,
  voteTalliesByPlayer: {},
  computerPlayers: [
    "Funk",
    "Foo",
    "Grandpop",
    "Grandma",
    "Preston",
    "Mouth",
    "Crayon"
  ],
  availableComputerPlayers: [],
  playerImages: [
    "blue",
    "darkgreen",
		"green",
		"lightblue",
		"orange",
		"pink",
		"red",
		"white"
  ],
  availablePlayerImages: [],
  addPlayerForm: {
    name: "",
  },
  players: [],
  tasks: [
    {
      id: 1,
      description: "Fix wiring",
      completed: false,
      playerName: null
    },
    {
      id: 2,
      description: "Unlock manifolds",
      completed: false,
      playerName: null
    },
    {
      id: 3,
      description: "Swipe card",
      completed: false,
      playerName: null
    },
    {
      id: 4,
      description: "Stabilize steering",
      completed: false,
      playerName: null
    },
    {
      id: 5,
      description: "Destroy asteroids",
      completed: false,
      playerName: null
    },
    {
      id: 6,
      description: "Fill the fuel tank",
      completed: false,
      playerName: null
    }
  ],
  rooms: [
    {
      name: "Cafeteria",
      taskId: 1,
      playerNames: [],
      emergencyButton: true
    },
    {
      name: "Reactor",
      taskId: 2,
      playerNames: [],
    },
    {
      name: "Admin",
      taskId: 3,
      playerNames: [],
    },
    {
      name: "Navigation",
      taskId: 4,
      playerNames: [],
    },
    {
      name: "Weapons",
      taskId: 5,
      playerNames: [],
    },
    {
      name: "Engine",
      taskId: 6,
      playerNames: [],
    },
  ]
}

const updatePlayerName = (state, action) => {
  return {
    ...state,
    addPlayerForm: {
      name: action.name
    }
  }
}

const addPlayer = (state, action) => reduceAll(state,
  mutatorToReducer(state => addPlayerMutator(state, action))
)

const init = state => reduceAll(state,
  resetAvailableComputerPlayers,
  resetAvailablePlayerImages,
)

const startGame = state => reduceAll(state,
  state => ({
    ...state,
    gameOver: false,
    victory: false
  }),
  resetCurrentTurnPlayerIndex,
  pickImposter,
  mutatorToReducer(movePlayersToCafeteria),
)

const selectRoom = (state, action) => reduceAll(state,
  mutatorToReducer(state => moveCurrentPlayerToRoom(state, action.roomName)),
)

const selectTask = (state, action) => reduceAll(state,
  mutatorToReducer(newState => assignPlayerToTask(newState, action.taskId)),
)

const nextPlayerTurn = state => reduceAll(state,
  (state) => ({
     ...state,
     currentTurnPlayerIndex: getNextPlayerTurnIndex(state)
   }),
   mutatorToReducer(finishCurrentTurnPlayerTask),
   showCurrentPlayerNotification
)

const enableComputerPlayers = state => ({
  ...state,
  computerPlayersEnabled: true,
})

const startEmergencyMeeting = state => reduceAll(state,
  mutatorToReducer(startEmergencyMeetingMutator))

const voteImposter = (state, action) => reduceAll(state,
  mutatorToReducer(state => voteImposterMutator(state, action.playerName))
)

const votedOffImposter = (state, action) => ({
  ...state,
  gameOver: true,
  notify: {
    message: `Victory! ${action.voteResults.mostVoted.playerName} was the imposter!`,
    className: "victory"
  }
})
const votedTie = state => ({
  ...state,
  notify: {
    message: "Tie! No one was ejected.",
    className: "alert"
  }
})
const voteFailed = (state, action) => ({
  ...state,
  notify: {
    message: `${action.voteResults.mostVoted.playerName} was NOT the imposter!`,
    className: "alert"
  }
})

const emergencyMeetingFinished = state => ({
  ...state,
  emergencyMeetingStarted: false,
  emergencyMeetingInitiatedByPlayerIndex: null
})

const allTasksCompleted = state => ({
  ...state,
  gameOver: true,
  notify: {
    message: "All tasks were completed! The Crewmates Win!",
    className: "victory"
  }
})

map('init', init)
map('startGame', startGame)
map('enableComputerPlayers', enableComputerPlayers)
map('updatePlayerName', updatePlayerName)
map('addHumanPlayer', addPlayer)
map('addComputerPlayer', addPlayer)
map('onRoomSelected', selectRoom)
map('onTaskSelected', selectTask)
map('nextPlayerTurn', nextPlayerTurn)
map('onEmergencyMeetingSelected', startEmergencyMeeting)
map('voteImposter', voteImposter)
map('votedOffImposter', votedOffImposter)
map('votedTie', votedTie)
map('voteFailed', voteFailed)
map('emergencyMeetingFinished', emergencyMeetingFinished)
map('allTasksCompleted', allTasksCompleted)

/************************************************
 * Other Reducers, Helpers, and Shared Reducer Methods
 ************************************************/
const pickImposter = state => ({
  ...state,
  imposterPlayerName: ArrayUtils.sample(state.players).name
})

const resetCurrentTurnPlayerIndex = state => ({
  ...state,
  currentTurnPlayerIndex: -1
})

const resetAvailableComputerPlayers = state => ({
  ...state,
  availableComputerPlayers: ArrayUtils.clone(state.computerPlayers)
})

const resetAvailablePlayerImages = state => ({
  ...state,
  availablePlayerImages: ArrayUtils.clone(state.playerImages)
})

const showCurrentPlayerNotification = state => ({
  ...state,
  notify: {
    message: `${getCurrentTurnPlayerName(state)}'s turn!`,
    className: "turn"
  }
});

export const rootReducer = reducer

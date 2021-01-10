import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './redux/store'
import App from './components/App'

import {
  addComputerPlayer,
  addHumanPlayer, enableComputerPlayers, onEmergencyMeetingSelected,
  onRoomSelected,
  onTaskSelected, skipVote,
  startGame,
  updatePlayerName, voteImposter
} from "./redux/actions";

const rootElement = document.getElementById('root')
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    rootElement
)

const steps = [
  () => updatePlayerName("Jackson"),
  () => addHumanPlayer(),
  () => updatePlayerName("Daddy"),
  () => addHumanPlayer(),
  () => updatePlayerName("Foo"),
  () => addComputerPlayer(),
  () => updatePlayerName("Baz"),
  () => addComputerPlayer(),
  () => startGame(),
  () => onTaskSelected(1), // Jackson
  () => onRoomSelected("Reactor"), // Daddy
  () => onRoomSelected("Navigation"), // Foo
  () => onTaskSelected(3), // Baz
  () => onEmergencyMeetingSelected(), // jackson
  () => voteImposter("Foo"), // Jackson
  () => voteImposter("Foo"), // Daddy
  () => skipVote(), // Foo
  () => voteImposter("Jackson"), // Baz
  () => enableComputerPlayers()
]
let currentStepIndex = 0;
let runStep = () => {
  console.log(steps[currentStepIndex])
  store.dispatch(steps[currentStepIndex]());
  currentStepIndex++;
  if (currentStepIndex === steps.length) {
    clearInterval(intervalId);
  }
}

let intervalId = setInterval(() => runStep(), 100)




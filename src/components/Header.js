import { connect } from "react-redux";
import Notify from "./Notify"
import {
  updatePlayerName,
  addHumanPlayer,
  addComputerPlayer,
  startGame
} from "../redux/actions"

const Header = ({
    addPlayerForm,
    updatePlayerName,
    addHumanPlayer,
    addComputerPlayer,
    startGame
}) => (
  <div className="header">
    <div className="title">AMONG US</div>
    <div className="gameControls">
      <div className="addHumanPlayer">
        <input id="playerName" placeholder="Player Name"
               value={addPlayerForm.name}
               onKeyUp={e => {
                 if (e.code === 'Enter') {
                   addHumanPlayer()
                 }
               }}
               onChange={(e) => {
                 updatePlayerName(e.target.value);
               }}/>
        <button id="addHumanPlayer" onClick={() => addHumanPlayer()}>Add Human Player</button>
      </div>
      <button id="addComputerPlayer" onClick={() => addComputerPlayer()}>Add Computer Player</button>
      |
      <button id="startButton" onClick={() => startGame()}>Start!</button>
    </div>
    <Notify/>
  </div>
)

const mapStateToProps = state => ({
  addPlayerForm: state.addPlayerForm
})

export default connect(
    mapStateToProps,
    {
      updatePlayerName,
      addHumanPlayer,
      addComputerPlayer,
      startGame,
    }
)(Header);

import React from "react";
import {connect} from "react-redux";
import Player from "./Player";
import Task from "./Task"
import {
  getTaskForRoom,
  getPlayersInRoom,
  isCurrentTurnPlayerAbleToSelectRoom,
} from "../selectors/selectors"
import {
  onRoomSelected,
} from "../redux/actions";
import EmergencyMeetingButton from "./EmergencyMeetingButton";

const Room = ({
                room,
                players,
                task,
  currentTurnPlayerAbleToSelectRoom,
  onRoomSelected
}) => (
  <div className="room" onClick={() => {
    if (currentTurnPlayerAbleToSelectRoom) {
      onRoomSelected(room.name)
    }
  }}>
    <div>
      <div className="roomName">{room.name}</div>
      <div className="taskContainer">
        <Task task={task}/>
      </div>
      {
        room.emergencyButton ? <EmergencyMeetingButton/> : null
      }
    </div>
    <div className="players">
        {
            getPlayersInRoom(players, room).map(player => <Player key={player.name} player={player}/>)
        }
    </div>
  </div>
)

const mapStateToProps = (state, ownProps) => ({
  room: ownProps.room,
  players: state.players,
  task: getTaskForRoom(state, ownProps.room),
  currentTurnPlayerAbleToSelectRoom: isCurrentTurnPlayerAbleToSelectRoom(state, ownProps.room),
})

export default connect(
    mapStateToProps,
    {
      onRoomSelected,
    }
)(Room);

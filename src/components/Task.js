import React from "react";
import { connect } from "react-redux";
import {onTaskSelected} from "../redux/actions";
import {
  getRoomForTask,
  isCurrentTurnPlayerAbleToSelectTask,
  isCurrentTurnPlayerHumanAndInRoom
} from "../selectors/selectors";

const Task = ({
  task,
  currentTurnPlayerAbleToPerformTask,
  isCurrentTurnPlayerHumanAndInRoom,
  onTaskSelected
}) => (
  <div className={`task ${currentTurnPlayerAbleToPerformTask ? "selectable" : ""}`} onClick={(e) => {
    if (currentTurnPlayerAbleToPerformTask) {
      onTaskSelected(task.id)
    }
    e.stopPropagation() // otherwise it'll fire the room selection
  }}>
    <div className="description">{
      task.playerName ? `${task.playerName} is performing ${task.description}` :
          task.completed && isCurrentTurnPlayerHumanAndInRoom ? `${task.description} completed` : task.description
    }</div>
  </div>
);

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  isCurrentTurnPlayerHumanAndInRoom: isCurrentTurnPlayerHumanAndInRoom(state, getRoomForTask(state, ownProps.task)),
  currentTurnPlayerAbleToPerformTask: isCurrentTurnPlayerAbleToSelectTask(state, ownProps.task),
})

export default connect(
  mapStateToProps, {
  onTaskSelected
})(Task);


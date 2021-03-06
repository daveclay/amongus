import React from "react";
import { connect } from "react-redux";
import {
  isCurrentTurnPlayer, isImposter,
} from "../selectors/selectors"
import {
  skipVote,
  voteImposter
} from "../redux/actions";

const getPlayerClassName = (isImposter, isCurrentTurn, celebrate) => {
  if (isImposter && celebrate) {
    return "playerEjected"
  } else if (isCurrentTurn || celebrate) {
    return "turnHighlight"
  } else {
    return ""
  }
}

const Player = ({
  celebrate,
  player,
  isCurrentTurn,
  votingEnabled,
  skipVote,
  voteImposter,
  isImposter
}) => (
    <div className={`player ${getPlayerClassName(isImposter, isCurrentTurn, celebrate)}`}>
      <div>
        <div className="imageContainer">
          <img src={`character-images/${player.image}.png`}/>
        </div>
        <div className="playerContent">
          <span className="playerName">{player.name}</span>
          <span className="status">
            {
              isCurrentTurn ? "'s turn!" : ""
            }
          </span>
          <div>
            {
              votingEnabled ?
                  isCurrentTurn ?
                      <button className="skipButton"
                              onClick={() => skipVote()}>Skip</button>
                      :
                      <button className="voteButton"
                              onClick={() => voteImposter(player.name)}>Vote</button>
                  : null
            }
          </div>
        </div>
      </div>
    </div>
);

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  celebrate: state.gameOver,
  isCurrentTurn: isCurrentTurnPlayer(state, ownProps.player),
  votingEnabled: state.emergencyMeetingStarted,
  isImposter: isImposter(state, ownProps.player)
})

export default connect(mapStateToProps, {
  skipVote,
  voteImposter
})(Player);

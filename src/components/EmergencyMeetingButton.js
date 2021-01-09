import React from "react";
import {connect} from "react-redux";
import {
  isEmergencyButtonEnabled
} from "../selectors/selectors"
import {
  onEmergencyMeetingSelected,
} from "../redux/actions";

const EmergencyMeetingButton = ({
  emergencyMeetingButtonEnabled,
  emergencyMeetingStarted,
  onEmergencyMeetingSelected,
}) => (
    <button disabled={!emergencyMeetingButtonEnabled}
            onClick={() => {
              if (!emergencyMeetingStarted) {
                onEmergencyMeetingSelected()
              }
            }}
            id="emergencyMeetingButton">Emergency Meeting!</button>
)

const mapStateToProps = state => ({
  emergencyMeetingStarted: state.emergencyMeetingStarted,
  emergencyMeetingButtonEnabled: isEmergencyButtonEnabled(state)
})

export default connect(
    mapStateToProps,
    {
      onEmergencyMeetingSelected,
    }
)(EmergencyMeetingButton);

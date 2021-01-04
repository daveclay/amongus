import React from "react";
import {connect} from "react-redux";
import Room from "./Room"

const Rooms = ({ rooms }) => (
    <div>
      { rooms.map(room => <Room key={room.name} room={room}/>) }
    </div>
)

const mapStateToProps = state => ({
    rooms: state.rooms
})

export default connect(mapStateToProps)(Rooms);

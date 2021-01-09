import React from "react";
import { connect } from "react-redux";

const Notify = ({notify}) => (
    notify.message == null ? "<div/>" : <div id="notify" className={notify.className}>{notify.message}</div>
);

const mapStateToProps = state => ({
  notify: state.notify
})

export default connect(mapStateToProps)(Notify);


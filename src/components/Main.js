import React, { Component } from 'react';
import { connect } from 'react-redux';

class Main extends Component {
  render() {
    const {
      clock
    } = this.props;

    return (
      <div>
        <div>Beat: <strong>{clock.currentTick}</strong></div>
        <div>Current Time: <strong>{clock.tickTimer}</strong></div>
        <div>Next Time: <strong>{clock.nextTime}</strong></div>
        <div>Next Time ahead: <strong>{clock.tickTimer < clock.nextTime ? 'true' : 'false'}</strong></div>
      </div>
    );
  }
}

export default connect(
  (state, props) => {

    return {
      clock: state.clock
    };
  }
)(Main);

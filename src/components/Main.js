import React, { Component } from 'react';
import { connect } from 'react-redux';

class Main extends Component {
  render() {
    const {
      clock
    } = this.props;

    return (
      <div>
        <div>{clock.currentTick}</div>
        <div>{clock.tickTimer} </div>
        <div>{clock.nextTime} </div>
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

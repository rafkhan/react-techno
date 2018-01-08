import React, { Component } from 'react';
import { connect } from 'react-redux';

import { scheduleTrack } from '../modules/clock';

class Main extends Component {
  render() {
    const {
      clock,
      startTrack
    } = this.props;

    return (
      <div>
        <div>Beat: <strong>{clock.currentTick}</strong></div>
        <div>Current Time: <strong>{clock.tickTimer}</strong></div>
        <div>Next Time: <strong>{clock.nextTime}</strong></div>
        <div>Next Time ahead: <strong>{clock.tickTimer < clock.nextTime ? 'true' : 'false'}</strong></div>
        <div>Loop Schedule Queue: <strong>{JSON.stringify(clock.playingTracks)}</strong></div>

        <button onClick={() => startTrack(0)}>KICK</button>
        <button onClick={() => startTrack(1)}>CLAP</button>
        <button onClick={() => startTrack(2)}>HI HAT</button>
        <button onClick={() => startTrack(3)}>SYNTH BASS</button>
        <button onClick={() => startTrack(4)}>SYNTH LEAD</button>
      </div>
    );
  }
}

export default connect(
  (state, props) => {

    return {
      clock: state.clock
    };
  },

  (dispatch, props) => {
    const startTrack = (trackNumber) => dispatch(scheduleTrack(trackNumber));
    return {
      startTrack
    };
  }
)(Main);

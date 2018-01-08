const TICK = 'TICK';

const BPM = 128;
const TIME_PER_BEAT = 60000 / BPM;


window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
//For Safari audioContext is disabled until there's a user click
if(audioContext.state === 'suspended'){
  audioContext.resume();
};

// oscillator.start(0); // Play instantly

const defaultState = {
  tickTimer: audioContext.currentTime,
  currentTick: 0,
  lastTick: 0,
  nextTime: 0,
  scheduleQueue: []
};

export default function(state = defaultState, action = {}) {
  const payload = action.payload;
  switch(action.type) {

    // TODO make this shorter lol
    case TICK:
      const currentTick = getTickNumber(payload.currentTime);
      let lastTick;
      let nextTime;
      // tick changed
      if(currentTick > state.currentTick) {
        lastTick = state.currentTick;
        nextTime = getNextTime(state);

        // scheduleMetronome(nextTime);
      } else {
        lastTick = state.lastTick;
        nextTime = state.nextTime;
      }

      return {
        ...state,
        tickTimer: payload.currentTime,
        currentTick,
        lastTick,
        nextTime
      };
    default:
      return state;
  }
}

function scheduleMetronome(nextTime) {
  const oscillator = audioContext.createOscillator();
  oscillator.connect(audioContext.destination);
  oscillator.start(nextTime);
  oscillator.stop(nextTime + 0.1);
}

function getNextTime(state) {
  return ((state.tickTimer * 1000) % ((state.currentTick + 1) * TIME_PER_BEAT) / 1000);
}

function getTickNumber(ct) {
  const ctms = ct * 1000;
  return Math.floor(ctms / TIME_PER_BEAT);
}

export function tick() {
  return {
    type: TICK,
    payload: {
      currentTime: audioContext.currentTime
    }
  }
}

export function scheduleNextPlay(clockState) {
  // if(clockState.scheduleQueue.length > 0) {
  //   const ct = audioContext.currentTime;
  //   const deltaTime = ct - clockState.tickTime;
  //   const nextTime = TIME_PER_BEAT - deltaTime;
  //   oscillator.start(nextTime);
  // }
}

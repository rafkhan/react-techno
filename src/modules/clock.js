import BufferLoader from './BufferLoader';

const TICK = 'TICK';

const BPM = 128;
const TIME_PER_BEAT = 60000 / BPM;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
//For Safari audioContext is disabled until there's a user click
if(audioContext.state === 'suspended'){
  audioContext.resume();
};

const bufferLoader = new BufferLoader(
  audioContext,
  [
    '/sounds/kick.wav',
    '/sounds/claps.wav',
    '/sounds/hats.wav',
    '/sounds/bass.wav',
    '/sounds/synth.wav',
  ],
  (bufferList) => {
    bufferList.forEach(buf => {
      const source = audioContext.createBufferSource();
      source.buffer = buf;
      source.connect(audioContext.destination);
      source.start(0);
    });
  } 
);

bufferLoader.load();

const defaultState = {
  tickTimer: audioContext.currentTime,
  currentTick: 0,
  lastTick: 0,
  nextTime: 0,
  scheduleQueue: []
};

export default function(state = defaultState, action = {}) {
  switch(action.type) {
    case TICK:
      return doTick(state, action.payload);
    default:
      return state;
  }
}

function doTick(state, payload) {
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

  // Schedule sounds
  if(state.scheduleQueue.length > 0) {

  }

  return {
    ...state,
    tickTimer: payload.currentTime,
    currentTick,
    lastTick,
    nextTime
  };
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
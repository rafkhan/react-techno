import BufferLoader from './BufferLoader';

const TICK = 'TICK';
const START_CLOCK = 'START_CLOCK';

const BPM = 128;
const TIME_PER_BEAT = 60000 / BPM;

const SAMPLES = [
  '/sounds/kick.wav',
  '/sounds/claps.wav',
  '/sounds/hats.wav',
  '/sounds/bass.wav',
  '/sounds/synth.wav',
];

window.AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
//For Safari audioContext is disabled until there's a user click
if(audioContext.state === 'suspended'){
  audioContext.resume();
};

const gainNode = audioContext.createGain();
gainNode.gain.value = 0.05;
gainNode.connect(audioContext.destination);

const defaultState = {
  tickTimer: audioContext.currentTime,
  currentTick: 0,
  lastTick: 0,
  nextTime: 0,
  startTime: 0,
  scheduleQueue: [],
  bufferList: [],
  playingTracks: [0,1,2,3]
};

export default function(state = defaultState, action = {}) {
  switch(action.type) {
    case START_CLOCK:
      return {
        ...state,
        tickTimer: action.payload.currentTime,
        scheduleQueue: action.payload.scheduleQueue,
        bufferList: action.payload.bufferList,
        startTime: action.payload.currentTime
      };
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

  // tick changed - fired once per tick
  if(currentTick > state.currentTick) {
    lastTick = state.currentTick;
    nextTime = getNextTime(state);

    scheduleMetronome(nextTime);

    // TRIGGER LOOPS EVERY 16 BARS
    if(state.playingTracks.length > 0 && state.currentTick % 16 === 1) {
      state.playingTracks.forEach(trackNumber => {
        const source = audioContext.createBufferSource();
        source.buffer = state.bufferList[trackNumber];
        source.connect(audioContext.destination);
        source.start(nextTime);
      });
    }

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
}

function scheduleMetronome(nextTime) {
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.value = 400;
  oscillator.type = 'square';
  oscillator.connect(gainNode);
  oscillator.start(nextTime);
  oscillator.stop(nextTime + 0.075);
}

function getNextTime(state) {
  return (((state.tickTimer * 1000) % ((state.currentTick + 1) * TIME_PER_BEAT) / 1000) + state.startTime);
}

function getTickNumber(ct) {
  const ctms = ct * 1000;
  return Math.floor(ctms / TIME_PER_BEAT);
}

export function startClock(bufferList) {
  console.log(bufferList);
  return {
    type: START_CLOCK,
    payload: {
      currentTime: audioContext.currentTime,
      scheduleQueue: bufferList,
      bufferList
    }
  }
}

export function tick() {
  return {
    type: TICK,
    payload: {
      currentTime: audioContext.currentTime
    }
  }
}

export function loadTracks() {
  return new Promise((resolve, reject) => {
    const bufferLoader = new BufferLoader(
      audioContext,
      SAMPLES,
      (bufferList) => {
        resolve(bufferList);
      } 
    );

    bufferLoader.load();
  });
}
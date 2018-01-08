import { createStore, combineReducers } from 'redux';
import clock, {
  tick,
  loadTracks,
  startClock
} from './clock';

const rootReducer = combineReducers({
  clock
});

const store = createStore(rootReducer);
export default store;

// START THE ENGINES
loadTracks()
  .then((bufferList) => {
    store.dispatch(startClock(bufferList));
    setInterval(() => {
      store.dispatch(tick());
    }, 8);
  });

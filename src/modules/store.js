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

loadTracks()
  .then((bufferList) => {
    store.dispatch(startClock(bufferList));
    // START THE ENGINES
    setInterval(() => {
      store.dispatch(tick());
    }, 8);
  });

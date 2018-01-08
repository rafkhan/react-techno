import { createStore, combineReducers } from 'redux';
import clock, {
  tick
} from './clock';

const rootReducer = combineReducers({
  clock
});

const store = createStore(rootReducer);
export default store;

setInterval(() => {
  const state = store.getState();
  store.dispatch(tick());
}, 10);

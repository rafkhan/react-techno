import { createStore, combineReducers } from 'redux';
import clock, {
  tick
} from './clock';

const rootReducer = combineReducers({
  clock
});

const store = createStore(rootReducer);
export default store;

// START THE ENGINES
setInterval(() => {
  store.dispatch(tick());
}, 10);

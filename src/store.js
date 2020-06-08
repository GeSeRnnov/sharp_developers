import { createStore } from 'redux';
import mineReducer from './reducer';

const store = createStore(mineReducer);

export default store;

import { combineReducers } from 'redux';
import { covidReducer } from './covid/reducer';

export const rootReducer = combineReducers({
  covid: covidReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
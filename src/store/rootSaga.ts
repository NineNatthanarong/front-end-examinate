import { all } from 'redux-saga/effects';
import { watchCovidData } from './covid/sagas';

export function* rootSaga() {
  yield all([watchCovidData()]);
}
import { CovidState } from '../../types/covid.types';
import { FETCH_COVID_DATA, FETCH_COVID_DATA_SUCCESS, FETCH_COVID_DATA_FAILURE } from './actions';

const initialState: CovidState = {
  data: null,
  loading: false,
  error: null,
};

export const covidReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case FETCH_COVID_DATA:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_COVID_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };
    case FETCH_COVID_DATA_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
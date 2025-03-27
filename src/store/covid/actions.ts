import { CovidApiResponse } from '../../types/covid.types';

export const FETCH_COVID_DATA = 'FETCH_COVID_DATA';
export const FETCH_COVID_DATA_SUCCESS = 'FETCH_COVID_DATA_SUCCESS';
export const FETCH_COVID_DATA_FAILURE = 'FETCH_COVID_DATA_FAILURE';

export const fetchCovidData = () => ({
  type: FETCH_COVID_DATA,
});

export const fetchCovidDataSuccess = (data: CovidApiResponse) => ({
  type: FETCH_COVID_DATA_SUCCESS,
  payload: data,
});

export const fetchCovidDataFailure = (error: string) => ({
  type: FETCH_COVID_DATA_FAILURE,
  payload: error,
});
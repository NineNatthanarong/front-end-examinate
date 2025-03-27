import { call, put, takeLatest } from 'redux-saga/effects';
import axios, { AxiosResponse } from 'axios';
import { FETCH_COVID_DATA, fetchCovidDataSuccess, fetchCovidDataFailure } from './actions';
import { CovidApiResponse } from '../../types/covid.types';

const API_URL ='http://localhost:5000/api/covid-data';

const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return `Server Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
    } else if (error.request) {
      return 'Network Error: Unable to reach the server';
    }
  }
  return `Error: ${error.message || 'Unknown error'}`;
};

const transformApiResponse = (data: any): CovidApiResponse => {
  if (!data || !Array.isArray(data.results)) {
    throw new Error('Invalid API response format');
  }

  const sortedResults = [...data.results].sort((a, b) => 
    new Date(b.publishdate).getTime() - new Date(a.publishdate).getTime()
  );

  return {
    ...data,
    results: sortedResults
  };
};

function* fetchCovidDataSaga() {
  try {
    const config = {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    };

    const response: AxiosResponse<CovidApiResponse> = yield call(
      axios.get,
      API_URL,
      config
    );

    const transformedData = transformApiResponse(response.data);
    yield put(fetchCovidDataSuccess(transformedData));

  } catch (error) {
    const errorMessage = getErrorMessage(error);
    yield put(fetchCovidDataFailure(errorMessage));
    console.error('Error fetching COVID data:', error);
  }
}

export function* watchCovidData() {
  yield takeLatest(FETCH_COVID_DATA, fetchCovidDataSaga);
}

export const covidSagas = [
  watchCovidData
];

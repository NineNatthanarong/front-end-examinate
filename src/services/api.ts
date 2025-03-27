import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

interface CovidData {
  results: Array<{
    publishdate: string;
    totalCases: number;
    totalDeaths: number;
    totalRecovered: number;
    currentlyInfectedPatients: number;
    totalTests: number;
    currentlySeriousOrCritical: number;
    totalScreeningAirlinePassengers: number;
    totalScreeningBorder: number;
    totalPUI: number;
    totalHospitalPUI: number;
    totalPrivateHospital: number;
    totalPublicHospital: number;
    newCases: number;
    newDeaths: number;
    newRecovered: number;
  }>;
}

export const fetchCovidData = async (): Promise<CovidData> => {
  try {
    const response = await axios.get<CovidData>(`${API_URL}/covid-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching COVID data:', error);
    throw error;
  }
}; 
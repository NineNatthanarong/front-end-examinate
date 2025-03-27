export interface CovidDataResult {
    totalScreeningAirlines: number;
    totalScreeningAirlinePassengers: number;
    totalScreeningShipPassengers: number;
    totalScreeningBorder: number;
    totalScreeningImmigration: number;
    totalPUI: number;
    totalCases: number;
    totalRecovered: number;
    currentlyInfectedPatients: number;
    totalDeaths: number;
    currentlySeriousOrCritical: number;
    totalTests: number;
    publishdate: string;
  }
  
  export interface CovidApiResponse {
    count: number;
    last_update: string;
    source: string;
    results: CovidDataResult[];
  }
  
  export interface CovidState {
    data: CovidApiResponse | null;
    loading: boolean;
    error: string | null;
  }
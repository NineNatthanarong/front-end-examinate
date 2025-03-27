const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'COVID-19 API Proxy Server is running' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const API_URL = 'https://covid19.traffy.in.th/api/state-covid19';

app.get('/api/covid-data', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    
    const formattedData = {
      results: response.data.results.map(item => ({
        publishdate: item.publishdate,
        totalCases: item.totalCases || 0,
        totalDeaths: item.totalDeaths || 0,
        totalRecovered: item.totalRecovered || 0,
        currentlyInfectedPatients: item.currentlyInfectedPatients || 0,
        totalTests: item.totalTests || 0,
        currentlySeriousOrCritical: item.currentlySeriousOrCritical || 0,
        totalScreeningAirlinePassengers: item.totalScreeningAirlinePassengers || 0,
        totalScreeningBorder: item.totalScreeningBorder || 0,
        totalPUI: item.totalPUI || 0,
        totalHospitalPUI: item.totalHospitalPUI || 0,
        totalPrivateHospital: item.totalPrivateHospital || 0,
        totalPublicHospital: item.totalPublicHospital || 0,
        newCases: item.newCases || 0,
        newDeaths: item.newDeaths || 0,
        newRecovered: item.newRecovered || 0
      }))
    };

    res.json(formattedData);
  } catch (error) {
    console.error('Error fetching COVID data:', error);
    res.status(500).json({ error: 'Failed to fetch COVID data' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `The requested path ${req.path} was not found on this server`
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
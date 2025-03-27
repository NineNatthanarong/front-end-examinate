

import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactECharts from 'echarts-for-react';
import { RootState } from '../store/rootReducer';
import { fetchCovidData } from '../store/covid/actions';
import { CovidDataResult } from '../types/covid.types';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: RootState) => state.covid);

  useEffect(() => {
    dispatch(fetchCovidData());
  }, [dispatch]);

  const processedData = useMemo(() => {
    if (!data?.results) return null;
    
    
    const reversedData = [...data.results].reverse();

    return {
      dates: reversedData.map(item => item.publishdate),
      cases: reversedData.map(item => item.totalCases),
      deaths: reversedData.map(item => item.totalDeaths),
      recovered: reversedData.map(item => item.totalRecovered),
      active: reversedData.map(item => item.currentlyInfectedPatients),
      tests: reversedData.map(item => item.totalTests),
      critical: reversedData.map(item => item.currentlySeriousOrCritical),
      screening: reversedData.map(item => item.totalScreeningAirlinePassengers),
      screeningBorder: reversedData.map(item => item.totalScreeningBorder),
      pui: reversedData.map(item => item.totalPUI),
      newCases: reversedData.map(item => item.newCases || 0),
      newDeaths: reversedData.map(item => item.newDeaths || 0),
      newRecovered: reversedData.map(item => item.newRecovered || 0),
      totalHospitalPUI: reversedData.map(item => item.totalHospitalPUI),
      totalPrivateHospital: reversedData.map(item => item.totalPrivateHospital),
      totalPublicHospital: reversedData.map(item => item.totalPublicHospital),
    };
  }, [data]);

  
  const getLineChartOption = () => {
    if (!processedData?.dates || processedData.dates.length === 0) {
      return {
        title: {
          text: 'Daily New Cases Trend',
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      };
    }

    return {
      title: {
        text: 'Daily New Cases Trend',
        left: 'center',
        top: 0,
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(params: any) {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            const value = param.value !== undefined ? param.value.toLocaleString() : 'N/A';
            result += `${param.seriesName}: ${value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['New Cases', 'New Deaths', 'New Recovered'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: processedData.dates,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => value.toLocaleString()
        }
      },
      series: [
        {
          name: 'New Cases',
          type: 'line',
          data: processedData.newCases,
          smooth: true,
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#ff6b6b'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: 'rgba(255, 107, 107, 0.3)'
              }, {
                offset: 1,
                color: 'rgba(255, 107, 107, 0.1)'
              }]
            }
          }
        },
        {
          name: 'New Deaths',
          type: 'line',
          data: processedData.newDeaths,
          smooth: true,
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#96ceb4'
          }
        },
        {
          name: 'New Recovered',
          type: 'line',
          data: processedData.newRecovered,
          smooth: true,
          lineStyle: {
            width: 3
          },
          itemStyle: {
            color: '#4ecdc4'
          }
        }
      ]
    };
  };

  
  const getBarChartOption = () => {
    if (!processedData?.dates || processedData.dates.length === 0) {
      return {
        title: {
          text: 'Monthly Screening Comparison',
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      };
    }

    
    const monthlyData = processedData.dates.reduce((acc: any, date: string, index: number) => {
      const monthYear = date.split('-').slice(1).join('-'); 
      if (!acc[monthYear]) {
        acc[monthYear] = {
          airline: 0,
          border: 0
        };
      }
      acc[monthYear].airline += processedData.screening[index] || 0;
      acc[monthYear].border += processedData.screeningBorder[index] || 0;
      return acc;
    }, {});

    
    const months = Object.keys(monthlyData).slice(-5);
    const airlineData = months.map(month => monthlyData[month].airline);
    const borderData = months.map(month => monthlyData[month].border);

    return {
      title: {
        text: 'Monthly Screening Comparison',
        left: 'center',
        top: 0,
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: any) {
          let result = `${params[0].axisValue}<br/>`;
          params.forEach((param: any) => {
            const value = param.value !== undefined ? param.value.toLocaleString() : 'N/A';
            result += `${param.seriesName}: ${value}<br/>`;
          });
          return result;
        }
      },
      legend: {
        data: ['Airline Passengers Screening', 'Border Screening'],
        top: 30
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => value.toLocaleString()
        }
      },
      series: [
        {
          name: 'Airline Passengers Screening',
          type: 'bar',
          data: airlineData,
          itemStyle: {
            color: '#4ecdc4'
          }
        },
        {
          name: 'Border Screening',
          type: 'bar',
          data: borderData,
          itemStyle: {
            color: '#ff6b6b'
          }
        }
      ]
    };
  };

  
  const getPieChartOption = () => {
    if (!processedData?.totalHospitalPUI || !processedData?.totalPrivateHospital || !processedData?.totalPublicHospital || 
        processedData.totalHospitalPUI.length === 0 || processedData.totalPrivateHospital.length === 0 || processedData.totalPublicHospital.length === 0) {
      return {
        title: {
          text: 'Hospital PUI Distribution',
          left: 'center',
          top: 0,
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: []
        }]
      };
    }

    
    const totalPrivate = processedData.totalPrivateHospital.reduce((sum: number, value: number) => sum + (value || 0), 0);
    const totalPublic = processedData.totalPublicHospital.reduce((sum: number, value: number) => sum + (value || 0), 0);
    const total = totalPrivate + totalPublic;

    return {
      title: {
        text: 'Hospital PUI Distribution',
        left: 'center',
        top: 0,
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: function(params: any) {
          const percentage = ((params.value / total) * 100).toFixed(1);
          return `${params.name}: ${params.value.toLocaleString()} (${percentage}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 30
      },
      series: [
        {
          name: 'Hospital PUI Distribution',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { 
              value: totalPrivate, 
              name: 'Private Hospital',
              itemStyle: { color: '#4ecdc4' }
            },
            { 
              value: totalPublic, 
              name: 'Public Hospital',
              itemStyle: { color: '#ff6b6b' }
            }
          ]
        }
      ]
    };
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="chart-container">
        <ReactECharts option={getLineChartOption()} style={{ height: '400px' }} />
      </div>
      <div className="chart-container">
        <ReactECharts option={getBarChartOption()} style={{ height: '400px' }} />
      </div>
      <div className="chart-container">
        <ReactECharts option={getPieChartOption()} style={{ height: '400px' }} />
      </div>
    </div>
  );
};
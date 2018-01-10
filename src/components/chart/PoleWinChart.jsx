import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import { driverPoleVsWins } from './data.js';

const options = {
  scales: {
    yAxes: [{
      gridLines: {display: false}
    }],
    xAxes: [{
      ticks: {
        beginAtZero: true
      },
      gridLines: {display: false}
    }]
  },
}

/**
 * Render HorizontalBar chart comparing win and poles for a driver.
 *
 * Props: `driver` -- driver object.
 * @param {*} props
 */
const PoleWinChart = (props) => {
  console.log(props.driver);
  const chartData = driverPoleVsWins(props.driver);
  return <HorizontalBar data={chartData} options={options} />
}

export default PoleWinChart;
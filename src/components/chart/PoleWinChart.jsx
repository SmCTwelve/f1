import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { driverPoleVsWins } from './charts.js';

const options = {
  legend: {
    position: 'top'
  }
};

/**
 * Render HorizontalBar chart comparing win and poles for a driver.
 *
 * Props: `driver` -- driver object.
 * @param {*} props
 */
const PoleWinChart = (props) => {
  const chartData = driverPoleVsWins(props.driver);
  if (chartData) {
    return <Doughnut data={chartData} options={options} width={200} />;
  }
  return null;
}

export default PoleWinChart;
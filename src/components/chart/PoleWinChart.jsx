import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { driverPoleVsWins } from './charts.js';


/**
 * Render HorizontalBar chart comparing win and poles for a driver.
 *
 * Props: `driver` -- driver object.
 * @param {*} props
 */
const PoleWinChart = (props) => {
  const options = {
    maintainAspectRatio: props.mobile ? false : true,
    legend: {
      position: 'top'
    }
  };
  const chartData = driverPoleVsWins(props.driver);
  if (chartData) {
    if (props.mobile) {
      return <Doughnut data={chartData} options={options} />;
    }
    else {
      return <Doughnut data={chartData} options={options} width={200} />;
    }
  }
  return null;
}

export default PoleWinChart;
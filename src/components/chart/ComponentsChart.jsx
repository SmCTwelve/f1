import React from 'react';
import { Polar } from 'react-chartjs-2';
import { driverComponents } from './charts.js';

const options = {
  layout: {
    padding: {
      top: 5,
      bottom: 5
    }
  },
  legend: {position: 'left'},
  animation: {animateRotate: false},
}

/**
 * Render a polar chart showing engine components used for the driver.
 *
 * @param {*} props Driver.
 */
const ComponentsChart = (props) => {
  const chartData = driverComponents(props.driver);
  return <Polar data={chartData} options={options} />;
}

export default ComponentsChart;
import React from 'react';
import { Polar, defaults } from 'react-chartjs-2';
import { driverComponents } from './charts.js';

defaults.polarArea.scale.ticks.showLabelBackdrop = false;
defaults.polarArea.scale.ticks.stepSize = 1;

/**
 * Render a polar chart showing engine components used for the driver.
 *
 * @param {*} props Driver.
 */
const ComponentsChart = (props) => {
  const options = {
    maintainAspectRatio: props.mobile ? false : true,
    layout: {
      padding: {
        top: 5,
        bottom: 5
      }
    },
    legend: {
      position: 'left',
      fullWidth: props.mobile ? false : true,
      labels: {
        boxWidth: props.mobile ? 10 : 40
      }
    },
    animation: {animateRotate: false},
  }
  const chartData = driverComponents(props.driver);
  return <Polar data={chartData} options={options} />;
}

export default ComponentsChart;
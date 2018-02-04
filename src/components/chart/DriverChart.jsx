import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { driverTimings, driverStartFinish } from './charts.js';

/**
 * Render a line graph comparing best qualifying and race times for each race.
 *
 * Props: `driver` -- driver object
 */
export const TimingChart = (props) => {
  const chartData = driverTimings(props.driver);
  return <Line data={chartData} options={timingOptions} />;
}

/**
 * Render line graph showing start and finish position between races.
 *
 * Props: `driver` -- driver object
 */
export const PositionChart = (props) => {
  const chartData = driverStartFinish(props.driver);
  return <Line data={chartData} options={lineOptions} />;
}

// Line options
const lineOptions = {
  scales: {
    yAxes: [{
      type: 'linear',
      gridLines: {
        display: true
      },
      scaleLabel: {
        display: true,
        labelString: "position"
      }
    }],
    xAxes: [{
      scaleLabel: {
        display: true,
        labelString: "race"
      }
    }]
  },
  hover: {
    mode: 'index',
    intersect: false
  },
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: (ti, data) => {
        const label = data.datasets[ti.datasetIndex].label;
        const value = data.datasets[ti.datasetIndex].data[ti.index];
        return `${label}: ${value}`;
      },
      title: (ti) => {
        return `Round ${ti[0].xLabel}`;
      },
      footer: (ti) => {
        const start = ti[0].yLabel;
        const finish = ti[1].yLabel;
        return `Loss/Gain: ${start - finish}`;
      }
    }
  }
}

// Chart options for timing scale
const timingOptions = {
  scales: {
    yAxes: [{
      type: 'time',
      time: {
        parser: 'm:s.SSS',
        min: '0:00.000',
        max: '2.30.000',
        unit: 'seconds',
        unitStepSize: 20,
        displayFormats: {
          'seconds': 'm:ss.SSS'
        }
      },
      bounds: 'data',
      ticks: {
        source: 'auto'
      }
    }],
    xAxes: [{
      gridLines: {display: false},
      scaleLabel: {
        display: true,
        labelString: "race"
      }
    }]
  },
  hover: {
    mode: 'index',
    intersect: false
  },
  tooltips: {
    mode: 'index',
    intersect: false,
    callbacks: {
      label: (ti, data) => {
        const label = data.datasets[ti.datasetIndex].label;
        const value = data.datasets[ti.datasetIndex].data[ti.index];
        return `${label}: ${value}`;
      },
      title: (ti) => {
        return `Round ${ti[0].xLabel}`;
      }
    }
  }
};
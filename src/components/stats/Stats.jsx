import React from 'react';
import Driver from '../driver/Driver.jsx';
import { filterDrivers, chartTheme } from '../chart/charts.js';
import { defaults } from 'react-chartjs-2';

/**
 * Stats view component which controls the rendering and updating of Charts.
 *
 * Props: `data` -- stats data object to be used to build charts.
 *        `team` -- current team display.
 *        `mobile` -- triggers mobile specific chart options.
 */
const Stats = (props) => {
  // Get the drivers objects for this team
  const teamDrivers = filterDrivers(props.data, props.team);
  const fontColor = chartTheme(props.team);
  defaults.global.defaultFontColor = fontColor;
  return(
    <div className={`stats ${props.team}`} id="stats">
      <div className='driver-container'>
        {
          teamDrivers.map( (driver, index) => {
            return <Driver key={index} driver={driver} mobile={props.mobile}
              fontColor={fontColor} />
          })
        }
      </div>
    </div>
  );
}

export default Stats;
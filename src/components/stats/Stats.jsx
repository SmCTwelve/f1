import React from 'react';
import Driver from '../driver/Driver.jsx';
import { filterDrivers } from '../chart/data.js';

/**
 * Stats view component which controls the rendering and updating of Charts.
 *
 * Props: `data` -- stats data object to be used to build charts.
 *        `team` -- current team display.
 */
const Stats = (props) => {
  // Get the drivers objects for this team
  console.log(props.data);
  const teamDrivers = filterDrivers(props.data, props.team);
  return(
    <div className={`Stats ${props.team}`}>
      <div>
        {
          teamDrivers.map( (driver, index) => {
            return <Driver key={index} driver={driver} />
          })
        }
      </div>
    </div>
  );
}

export default Stats;
import React from 'react';
import PoleWinChart from '../chart/PoleWinChart.jsx';
import ComponentsChart from '../chart/ComponentsChart.jsx';
import { TimingChart, PositionChart } from '../chart/DriverChart.jsx';

/**
 * Render a driver card with portrait, title and stats.
 *
 * Props: `driver` -- a driver object from the stats JSON.
 *
 * @param {*} props
 */
const Driver = (props) => (
  <div className='driver-card'>
    <div className='driver-info'>
      <div className='driver-img'>
        <div className="placeholder"></div>
      </div>
      <div>
        <h3>{`${props.driver.firstName} ${props.driver.lastName}`}</h3>
        <ul>
          <li><strong>Code: </strong>{props.driver.code}</li>
          <li><strong>Age: </strong>{props.driver.age}</li>
          <li><strong>Nationality: </strong>{props.driver.nationality}</li>
          <li><strong>Championships: </strong>{props.driver.stats.wdc}</li>
        </ul>
        <div className='chart-pole-win'>
          <PoleWinChart driver={props.driver} />
        </div>
      </div>
    </div>
    <div className='driver-stats'>
      <div className='chart-components'>
        <ComponentsChart driver={props.driver} />
      </div>
      <div className="chart-timings">
        <TimingChart driver={props.driver} />
      </div>
      <div className="chart-position">
        <PositionChart driver={props.driver} />
      </div>
    </div>
  </div>
);

export default Driver;
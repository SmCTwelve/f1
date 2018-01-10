import React from 'react';
import PoleWinChart from '../chart/PoleWinChart.jsx';

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
      </div>
    </div>
    <div className='chart-pole-win'>
      <PoleWinChart driver={props.driver} />
    </div>
  </div>
);

export default Driver;
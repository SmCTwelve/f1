import React from 'react';
import PoleWinChart from '../chart/PoleWinChart.jsx';
import ComponentsChart from '../chart/ComponentsChart.jsx';
import { TimingChart, PositionChart } from '../chart/DriverChart.jsx';

/**
 * Render a driver card with portrait, title and stats.
 *
 * Props: `driver` -- a driver object from the stats JSON.
 *        `mobile` -- triggers mobile specific chart options.
 *
 * @param {*} props
 */
const Driver = (props) => {
  return(
    <div className='driver-card'>
      <div className='driver-info'>
        <div className='driver-img'>
          <div className="placeholder"></div>
        </div>
        <div style={{color: props.fontColor}}>
          <h3>{`${props.driver.firstName} ${props.driver.lastName}`}</h3>
          <ul>
            <li><strong>Code: </strong>{props.driver.code}</li>
            <li><strong>Age: </strong>{props.driver.age}</li>
            <li><strong>Nationality: </strong>{props.driver.nationality}</li>
            <li><strong>Championships: </strong>{props.driver.stats.championships}</li>
          </ul>
          {props.mobile ?
            null :
            <div className='chart-pole-win'>
              <PoleWinChart {...props} />
            </div>
          }
        </div>
      </div>
      {props.mobile ?
      <div className='chart-pole-win'>
        <PoleWinChart {...props} />
      </div> : null
      }
      <div className='driver-stats'>
        <div className='chart-components'>
          <ComponentsChart {...props} />
        </div>
        <div className="chart-timings">
          <TimingChart {...props} />
        </div>
        <div className="chart-position">
          <PositionChart {...props} />
        </div>
      </div>
    </div>
  );
}

export default Driver;
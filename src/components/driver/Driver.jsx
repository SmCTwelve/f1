import React from 'react';
import PoleWinChart from '../chart/PoleWinChart.jsx';
import Picture from '../picture/Picture.jsx';
import ComponentsChart from '../chart/ComponentsChart.jsx';
import { TimingChart, PositionChart } from '../chart/DriverChart.jsx';
import vet from '../../images/driver-vet.jpg';
import rai from '../../images/driver-rai.jpg';
import ham from '../../images/driver-ham.jpg';
import bot from '../../images/driver-bot.jpg';
import ric from '../../images/driver-ric.jpg';
import ver from '../../images/driver-ver.jpg';
import mas from '../../images/driver-mas.jpg';
import str from '../../images/driver-str.jpg';
import hul from '../../images/driver-hul.jpg';
import pal from '../../images/driver-pal.jpg';
import sai from '../../images/driver-sai.jpg';
import alo from '../../images/driver-alo.jpg';
import van from '../../images/driver-van.jpg';

/**
 * Return the correct driver portrait image.
 * @param {Object} driver The driver object
 */
const getImage = (driver) => {
  const code = driver.code;
  const image = {
    'VET': vet,
    'RAI': rai,
    'HAM': ham,
    'BOT': bot,
    'RIC': ric,
    'VER': ver,
    'MAS': mas,
    'STR': str,
    'HUL': hul,
    'PAL': pal,
    'SAI': sai,
    'ALO': alo,
    'VAN': van
  }
  return image[code];
}

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
          <Picture src={getImage(props.driver)} alt={props.driver.code} width={200} height={250} />
        </div>
        <div style={{color: props.fontColor}}>
          <h3>{`${props.driver.firstName} ${props.driver.lastName}`}</h3>
          <ul>
            <li><strong>Code: </strong>{props.driver.code}</li>
            <li><strong>Age: </strong>{props.driver.age}</li>
            <li><strong>Nationality: </strong>{props.driver.nationality}</li>
            <li><strong>Championships: </strong>{props.driver.stats.championships}</li>
          </ul>
          {/* Render pole chart as part of driver-info on desktop */}
          {props.mobile ?
            (null) : (
            <div className='chart-pole-win'>
              <PoleWinChart {...props} />
            </div>
            )
          }
        </div>
      </div>
      {/* Render pole chart in its own block on mobile */}
      {props.mobile ? (
        <div className='chart-pole-win'>
          <PoleWinChart {...props} />
        </div>
        ) : (null)
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
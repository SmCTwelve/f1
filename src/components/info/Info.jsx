import React from 'react';
import StatsChart from '../chart/StatsChart.jsx';
import teams from '../../api/teams.json';

const teamName = (name) => {
  let result = name;
  // Replace underscore and capitalise 'Bull'
  if (name === 'red_bull') {
    result = name.replace('_', ' ').replace('b', 'B');
  }
  // Capitalise first letter and concatenate with rest of string -1
  return result.charAt(0).toUpperCase() + result.slice(1);
}

const teamInfo = (team) => {
  return teams[team].description;
}

/**
 * Render team info, car info and stat graphs.
 * @param {*} props
 */
const Info = (props) => (
  <div id="info" className="info">
    <div className="content">
      <div className="team-info">
        <h1 className="hdg">{teamName(props.team)}</h1>
        <p>{teamInfo(props.team)}</p>
      </div>
      <StatsChart {...props} />
    </div>
  </div>
);

export default Info;
import React from 'react';
import {Link} from 'react-router-dom';
import iconFerrari from '../../images/logo-ferr.png';
import iconRedbull from '../../images/logo-rb.png';
import iconRenault from '../../images/logo-rs.png';
import iconWilliams from '../../images/logo-wr.png';
import iconMercedes from '../../images/logo-mer.png';
import iconMclaren from '../../images/logo-mcl.png';

const teamLogos = {
  'ferrari': iconFerrari,
  'red_bull': iconRedbull,
  'renault': iconRenault,
  'williams': iconWilliams,
  'mercedes': iconMercedes,
  'mclaren': iconMclaren
}

/**
 * Renders a team logo component based on the specified team.
 *
 * Props:
 * `team` -- full team name e.g. <Logo team="williams" />;
 * `tab` -- tab index for accessibility.
 */
const Logo = (props) => {
  const team = props.team;
  let src = teamLogos[team];

  return(
    <div className="logo-container" role="link" tabIndex={0}>
      <Link to={`/${props.team}`} >
        <img className="logo" src={src} alt={team} />
      </Link>
    </div>
  );
};

export default Logo;
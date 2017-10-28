import React from 'react';
import iconFerrari from '../../images/logo-ferr.png';
import iconRedbull from '../../images/logo-rb.png';
import iconRenault from '../../images/logo-rs.png';
import iconWilliams from '../../images/logo-wr.png';

const images = {
  ferrari: iconFerrari,
  redbull: iconRedbull,
  renault: iconRenault,
  williams: iconWilliams
}

/**
 * Renders a team logo component based on the specified team.
 *
 * Props: `team` -- full team name e.g. <Logo team="williams" />
 */
const Logo = (props) => {
  const team = props.team;
  let src = "";
  switch (team) {
    case 'ferrari':
      src = images.ferrari;
      break;
    case 'redbull':
      src = images.redbull;
      break;
    case 'renault':
      src = images.renault;
      break;
    case 'williams':
      src = images.williams;
      break;

    default:
      break;
  }

  return(
    <div className="logo">
      <img src={src} alt={team} />
    </div>
  );
};

export default Logo;
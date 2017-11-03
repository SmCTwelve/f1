import React from 'react';
import iconFerrari from '../../images/logo-ferr.png';
import iconRedbull from '../../images/logo-rb.png';
import iconRenault from '../../images/logo-rs.png';
import iconWilliams from '../../images/logo-wr.png';

const teamLogos = {
  ferrari: iconFerrari,
  redbull: iconRedbull,
  renault: iconRenault,
  williams: iconWilliams
}

/**
 * Renders a team logo component based on the specified team.
 *
 * Props:
 * `team` -- full team name e.g. <Logo team="williams" />;
 * `click` -- event handler to be called when image is clicked;
 * `tab` -- tab index for accessibility.
 */
const Logo = (props) => {
  const team = props.team;
  let src = "";
  switch (team) {
    case 'ferrari':
      src = teamLogos.ferrari;
      break;
    case 'redbull':
      src = teamLogos.redbull;
      break;
    case 'renault':
      src = teamLogos.renault;
      break;
    case 'williams':
      src = teamLogos.williams;
      break;

    default:
      break;
  }

  // Call click event handler if present in props
  const handleClick = () => {
    if ('click' in props) {
      props.click(props.team);
      console.log("Logo Clicked");
    }
  };

  return(
    <div className="logo-container" role="link" tabIndex={0} onClick={handleClick} onKeyPress={handleClick}>
      <img className="logo" src={src} alt={team} />
    </div>
  );
};

export default Logo;
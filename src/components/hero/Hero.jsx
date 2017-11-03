import React from 'react';
import Logo from '../logo/Logo.jsx';
import Picture from '../picture/Picture.jsx';
import Ferrari from '../../images/car-fer.png';
import Redbull from '../../images/car-rbr.png';
import Renault from '../../images/car-rsr.png';

/**
 * Hero image component. Renders the team title and car in the header.
 *
 * Props:
 * `team` -- team name e.g. 'williams', 'redbull';
 * `title` -- full team title to display in header, e.g. 'Scuderia Ferrari'.
 * @param {*} props
 */
const Hero = (props) => {

  let src = "";
  // Get correct car image
  switch (props.team) {
    case "ferrari":
      src = Ferrari;
      break;
    case "redbull":
      src = Redbull;
      break;
    case "renault":
      src = Renault;
      break;

    default:
      break;
  }

  const carWidth = 1000;
  const carHeight = 228;

  return(
    <div className="hero">
      <Logo team={props.team} />
      <Picture src={src} alt={props.team} width={carWidth} height={carHeight} />
      <h3 className="hdg">{props.title}</h3>
    </div>
)};

export default Hero;
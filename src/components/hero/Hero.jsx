import React from 'react';
import Logo from '../logo/Logo.jsx';
import Ferrari from '../../images/car-fer.png';
import Redbull from '../../images/car-rbr.png';
import Renault from '../../images/car-rsr.png';

/**
 * Hero image component. Renders the team title and car in the header.
 *
 * Props:
 * `team` -- team name, 'williams', 'redbull'.
 * `title` -- full team title to display in header, e.g. 'Scuderia Ferrari'.
 * @param {*} props
 */
const Hero = (props) => {

  // Get correct car image
  let url = "";
  switch (props.team) {
    case "ferrari":
      url = Ferrari;
      break;
    case "redbull":
      url = Redbull;
      break;
    case "renault":
      url = Renault;
      break;

    default:
      break;
  }

  return(
    <div className="hero content">
      <Logo team={props.team} />
      <img src={url} alt={props.title} />
      <h3 className="hdg">{props.title}</h3>
    </div>
)};

export default Hero;
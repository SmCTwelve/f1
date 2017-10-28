import React from 'react';
import Ferrari from '../../images/car-fer.png';

/**
 * Hero image component. Renders the team title and car in the header.
 *
 * Props:
 * `team` -- 3 letter team suffix, e.g. 'rbr', 'fer'.
 * `title` -- full team name to display in header.
 * @param {*} props
 */
const Hero = (props) => {

  let url = "";
  switch (props.team) {
    case "fer":
      url = Ferrari;
      break;

    default:
      break;
  }

  return(
    <div className="hero content">
      <img src={url} alt={props.title} />
      <h3 className="hdg">{props.title}</h3>
    </div>
)};

export default Hero;
import React from 'react';
import Picture from '../picture/Picture.jsx';
import Ferrari from '../../images/car-fer.png';
import Redbull from '../../images/car-rbr.png';
import Renault from '../../images/car-rsr.png';
import Mercedes from '../../images/car-mer.png';
import Mclaren from '../../images/car-mcl.png';
import Williams from '../../images/car-wr.png';

const cars = {
  'ferrari': Ferrari,
  'red_bull': Redbull,
  'renault': Renault,
  'williams': Williams,
  'mercedes': Mercedes,
  'mclaren': Mclaren
}

/**
 * Hero image component. Renders the team title and car in the header.
 *
 * Props:
 * `team` -- team name e.g. 'williams', 'redbull';
 * `title` -- full team title to display in header, e.g. 'Scuderia Ferrari'.
 * @param {*} props
 */
const Hero = (props) => {

  const src = cars[props.team];

  const carWidth = 1000;
  const carHeight = 228;

  return(
    <div className="hero">
      <Picture src={src} alt={props.team} width={carWidth} height={carHeight} />
      <h3 className="hdg">{props.title}</h3>
    </div>
)};

export default Hero;
import React from 'react';
import Hero from '../hero/Hero.jsx';
import Nav from '../nav/Nav.jsx';

/**
 * Main view container for the selected team.
 *
 * Props: `team` -- the selected team.
 */

 const TeamView = (props) => (
  <div>
    <Nav team={props.team} index={false} />
    <main id="main">
      <div className={"hero-container " + props.team}>
        <Hero team={props.team} />
      </div>
      <div id="info" className="info">
        <div className="content">
        <h1 className="hdg">{props.team}</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro odio reiciendis illum corrupti, dolore esse, laborum, necessitatibus dolorem nostrum officiis quo delectus dolorum quibusdam? Quae maxime commodi expedita dignissimos. Quasi?</p>
        </div>
      </div>
      <div className={"stats " + props.team}></div>
    </main>
  </div>
 );

 export default TeamView;
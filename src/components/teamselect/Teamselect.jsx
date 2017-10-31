import React from 'react';
import Logo from '../logo/Logo.jsx';

// List of team names -- USE teams.json KEYS --
const teams = [
  'ferrari',
  'redbull',
  'renault'
]

/**
 * Default landing page to choose which team page to view. Component presents each team
 * logo to be clicked on, which will render the content for that team.
 *
 * Component is rendered by default on initial page visit, when the 'index' state of the controlling Team component
 * is set to 'true'. Clicking one of the logos sets the state to 'false' causing the page to re-render with the new
 * content. Pressing the Home link also renders the team selection.
 *
 * Props: `handleOnClick` - function reference to be called when clicked.
 */
const TeamSelect = (props) => {

  const click = (team) => {
    props.handleOnClick(team);
    console.log("Update");
  }

  const logos = teams.map( (team, index) =>
    <Logo team={team} key={index} onClick={() => {click(team)}} />
  );

  return(
    <div className="team-select">
      {logos}
    </div>
  );
};

export default TeamSelect;

import React from 'react';
import Logo from '../logo/Logo.jsx';

/**
 * Default landing page to choose which team page to view. Component presents each team
 * logo to be clicked on, which will render the content for that team.
 *
 * Component is rendered by default on initial page visit, when the 'index' state of the controlling Team component
 * is set to 'true'. Clicking one of the logos sets the state to 'false' causing the page to re-render with the new
 * content. Pressing the Home link also renders the team selection.
 *
 * @param props 'teams' -- Array of team names from App component
 */
const TeamSelect = (props) => {

  // Map array of teams to array of Logo components to be rendered
  const logos = props.teams.map( (team, index) =>
    <Logo key={index} team={team} {...props} />
  );

  return(
    <div className="team-select">
      {logos}
    </div>
  );
};

export default TeamSelect;

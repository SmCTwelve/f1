import React from 'react';
import Nav from '../nav/Nav.jsx';
import TeamSelect from '../teamselect/Teamselect.jsx';

/**
 * Render team selection index page.
 *
 * Props: `handleOnClick` -- function reference to be called when team logo is clicked.
 */

 const SelectTeam = (props) => (
  <div>
    <Nav index={true} />
    <main id="main">
      <TeamSelect handleOnClick={props.handleOnClick} />
    </main>
  </div>
 );

 export default SelectTeam;
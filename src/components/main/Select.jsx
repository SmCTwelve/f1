import React, {Component} from 'react';
import Nav from '../nav/Nav.jsx';
import TeamSelect from '../teamselect/Teamselect.jsx';

/**
 * Render team selection index page.
 *
 * Props: `load` -- function to hide/unhide loader.
 */

 class SelectTeam extends Component {
   constructor(props) {
     super(props);
   }

   componentDidMount() {
    this.props.load(false);
  }
  componentDidUpdate() {
    this.props.load(false);
  }
  componentWillUpdate() {
    this.props.load(true);
  }
  componentWillMount() {
    this.props.load(true);
  }

   render() {
     return(
      <div>
        <Nav index={true} />
        <main id="main">
          <TeamSelect />
        </main>
      </div>
     );
   }
 }

 export default SelectTeam;
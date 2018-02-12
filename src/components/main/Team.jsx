import React, {Component} from 'react';
import Hero from '../hero/Hero.jsx';
import Nav from '../nav/Nav.jsx';
import Info from '../info/Info.jsx';
import Stats from '../stats/Stats.jsx';

/**
 * Main view container for the selected team.
 *
 * Props: `team` -- the selected team.
 *        `data` -- stats data object for charts.
 */

 class TeamView extends Component {
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
        <Nav team={this.props.team} index={false} mobile={this.props.mobile} />
        <main id="main">
          <div className={"hero-container " + this.props.team}>
            <Hero team={this.props.team} />
          </div>
          <Info {...this.props} />
          <Stats {...this.props} />
        </main>
      </div>
     );
   }
 }

 export default TeamView;
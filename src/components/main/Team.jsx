import React, {Component} from 'react';
import Hero from '../hero/Hero.jsx';
import Nav from '../nav/Nav.jsx';
import Stats from '../stats/Stats.jsx';
import StatsChart from '../chart/StatsChart.jsx';

const teamName = (name) => {
  let result = name;
  // Replace underscore and capitalise 'Bull'
  if (name === 'red_bull') {
    result = name.replace('_', ' ').replace('b', 'B');
  }
  // Capitalise first letter and concatenate with rest of string -1
  return result.charAt(0).toUpperCase() + result.slice(1);
}

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
          <div id="info" className="info">
            <div className="content">
              <h1 className="hdg">{teamName(this.props.team)}</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro odio reiciendis illum corrupti, dolore esse, laborum, necessitatibus dolorem nostrum officiis quo delectus dolorum quibusdam? Quae maxime commodi expedita dignissimos. Quasi?</p>
              <StatsChart {...this.props} />
            </div>
          </div>
          <Stats {...this.props} />
        </main>
      </div>
     );
   }
 }

 export default TeamView;
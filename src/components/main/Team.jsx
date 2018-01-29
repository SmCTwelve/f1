import React, {Component} from 'react';
import Hero from '../hero/Hero.jsx';
import Nav from '../nav/Nav.jsx';
import Stats from '../stats/Stats.jsx';
import DriverChart from '../chart/DriverChart.jsx';

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
     console.log("TEAM MOUNTED");
   }
   componentDidUpdate() {
     this.props.load(false);
     console.log("Updated...");
   }
   componentWillUpdate() {
     this.props.load(true);
     console.log("Updating...");
   }
   componentWillMount() {
     this.props.load(true);
   }

   render() {
     return(
      <div>
        <Nav team={this.props.team} index={false} />
        <main id="main">
          <div className={"hero-container " + this.props.team}>
            <Hero team={this.props.team} />
          </div>
          <div id="info" className="info">
            <div className="content">
              <h1 className="hdg">{this.props.team}</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro odio reiciendis illum corrupti, dolore esse, laborum, necessitatibus dolorem nostrum officiis quo delectus dolorum quibusdam? Quae maxime commodi expedita dignissimos. Quasi?</p>
              <DriverChart team={this.props.team} data={this.props.data} />
            </div>
          </div>
          <Stats data={this.props.data} team={this.props.team} />
        </main>
      </div>
     );
   }
 }

 export default TeamView;
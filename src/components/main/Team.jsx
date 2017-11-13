import React, {Component} from 'react';
import Hero from '../hero/Hero.jsx';
import Nav from '../nav/Nav.jsx';

/**
 * Main view container for the selected team.
 *
 * Props: `team` -- the selected team.
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
        <Nav team={this.props.team} index={false} />
        <main id="main">
          <div className={"hero-container " + this.props.team}>
            <Hero team={this.props.team} />
          </div>
          <div id="info" className="info">
            <div className="content">
            <h1 className="hdg">{this.props.team}</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro odio reiciendis illum corrupti, dolore esse, laborum, necessitatibus dolorem nostrum officiis quo delectus dolorum quibusdam? Quae maxime commodi expedita dignissimos. Quasi?</p>
            </div>
          </div>
          <div className={"stats " + this.props.team}></div>
        </main>
      </div>
     );
   }
 }

 export default TeamView;
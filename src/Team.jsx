import React, {Component} from 'react';
import Hero from './components/hero/Hero.jsx';

/**
 * Main component for team page to render Hero, Info and Stats components.
 *
 * Props:
 *
 */
class Team extends Component {
  constructor(props) {
    super(props);

    // State:
    // `team` -- the team to display, updates styles and content based on selected team.
    // `index` -- (bool) whether to render index page with team selection (default landing page).
    this.state = {
      team: this.props.team,
      index: true
    };
  }

  render() {
    if (this.state.index) {
      return(
        <div className={"hero-container " + this.props.team}>
          <Hero team={this.props.team} title={this.props.title} />
        </div>
      );
    }
    else {
      return(
        <div><h2>SELECT TEAM</h2></div>
      );
    }
  }
}

export default Team;
import React, {Component} from 'react';
import Hero from './components/hero/Hero.jsx';
import TeamSelect from './components/teamselect/Teamselect.jsx';

/**
 * Main component for team page to render Hero, Info and Stats components.
 */
class Team extends Component {
  constructor(props) {
    super(props);

    // State:
    this.state = {
      // `team` -- to display, updates styles and content based on selected team.
      // `index` -- whether to render index page with team selection (default landing page).
      team: "",
      index: true
    };

    this.updateTeam = this.updateTeam.bind(this);
  }

  // Change state of component to the chosen team
  updateTeam(team) {
    this.setState({
      team: team,
      index: false
    });
  }

  render() {
    if (!this.state.index) {
      return(
        <div>
          <div className={"hero-container " + this.state.team}>
            <Hero team={this.state.team} title={this.state.title} />
          </div>
          <div className="info"></div>
          <div className={"stats " + this.state.team}></div>
        </div>
      );
    }
    else {
      return(
        <TeamSelect handleOnClick={this.updateTeam} />
      );
    }
  }
}

export default Team;
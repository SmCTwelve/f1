import React, {Component} from 'react';
import Hero from './components/hero/Hero.jsx';
import TeamSelect from './components/teamselect/Teamselect.jsx';

/**
 * Main component for team page to render Hero, Info and Stats components.
 */
class Team extends Component {
  constructor(props) {
    super(props);

    // `index` -- whether to render index page with team selection (default landing page).
    this.index = true;

    // State:
    this.state = {
      // the team to display, updates styles and content based on selected team.
      team: null
    };

    this.updateTeam = this.updateTeam.bind(this);
  }

  // Change state of component to the chosen team
  updateTeam(team) {
    this.setState({team: team}, () => {
      this.index = false;
      console.log("SELECTED TEAM: " + team);
    });
  }

  render() {
    if (!this.index) {
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
import React, {Component} from 'react';
import Hero from './components/hero/Hero.jsx';
import Nav from './components/nav/Nav.jsx';
import TeamSelect from './components/teamselect/Teamselect.jsx';

const loader = document.getElementById('loader');
const root = document.getElementById('root');

/**
 * Main app component to render the page and provide core functionality.
 */
class App extends Component {
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

  // Remove hide class from any element that has it
  unhide() {
    const hidden = document.querySelectorAll(".hide");
    // Call Array.forEach() method for Edge and IE11 - don't support NodeList.forEach()
    Array.prototype.forEach.call(hidden, (element) => {
      element.classList.remove("hide");
    });
  }

  componentDidMount() {
    loader.style.display = 'none';
    this.unhide();
    console.log("TEAM COMPONENT MOUNTED");
    window.addEventListener('scroll', this.animateNav);
  }

  componentWillUpdate() {
    root.classList.add('hide');
    loader.style.display = 'block';
    console.log("TEAM IS UPDATING");
  }

  componentDidUpdate() {
    loader.style.display = 'none';
    this.unhide();
    console.log("TEAM COMPONENT WAS UPDATED");
  }

  render() {
    // Render view for selected team if not on index.
    if (!this.state.index) {
      return(
        <div>
          <Nav team={this.state.team} index={this.state.index} />
          <main id="main">
            <div className={"hero-container " + this.state.team}>
              <Hero team={this.state.team} title={this.state.title} />
            </div>
            <div id="info" className="info">
              <div className="content">
              <h1 className="hdg">{this.state.team}</h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro odio reiciendis illum corrupti, dolore esse, laborum, necessitatibus dolorem nostrum officiis quo delectus dolorum quibusdam? Quae maxime commodi expedita dignissimos. Quasi?</p>
              </div>
            </div>
            <div className={"stats " + this.state.team}></div>
          </main>
        </div>
      );
    }
    // Render index view and team selection.
    else {
      return(
        <div>
          <Nav index={this.state.index} />
          <main id="main">
            <TeamSelect handleOnClick={this.updateTeam} />
          </main>
        </div>

      );
    }
  }
}

export default App;
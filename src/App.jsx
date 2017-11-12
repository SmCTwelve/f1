import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import SelectTeam from './components/main/Select.jsx';
import TeamView from './components/main/Team.jsx';

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
    const updateTeam = this.updateTeam;
    const team = this.state.team;
    return(
      <Router>
        <Switch>
          {/* Index page */}
          <Route
            exact path="/"
            render={(props) =>
              <SelectTeam {...props} handleOnClick={updateTeam} />
            }
          />
          {/* Team page */}
          <Route
            path={`/${team}`}
            render={(props) =>
              <TeamView {...props} team={team} />
            }
          />
          {/* No match */}
          <Route
            render={() => <h1>Not Found</h1>}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
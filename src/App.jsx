import React, {Component} from 'react';
import {Router, Route, Switch, Redirect} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import SelectTeam from './components/main/Select.jsx';
import TeamView from './components/main/Team.jsx';

const loader = document.getElementById('loader');
const root = document.getElementById('root');
const hashHistory = createHashHistory();

/**
 * Main app component to render the page and provide core functionality.
 */
class App extends Component {
  constructor(props) {
    super(props);

    // Available teams
    this.teams = [
      'ferrari',
      'redbull',
      'renault'
    ]

    // State:
    this.state = {
    };
    this.loader = this.loader.bind(this);
  }

  loader(show) {
    if (show) {
      loader.style.display = "block";
      root.classList.add("hide");
    }
    else {
      loader.style.display = "none";
      root.classList.remove("hide");
    }
  }

  render() {
    return(
      <Router history={hashHistory}>
        <Switch>
          {/* Index page */}
          <Route
            exact path="/"
            render={(props) =>
              <SelectTeam {...props} load={this.loader} />
            }
          />
          {/* Team page */}
          <Route
            path={"/:team"}
            render={(props) => {
                const team = props.match.params.team;
                if (this.teams.includes(team)) {
                  return <TeamView {...props} team={team} load={this.loader} />
                }
                else {
                  return <Redirect to="/" />
                }
              }
            }
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
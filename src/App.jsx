import React, {Component} from 'react';
import {Router, Route, Switch, Redirect} from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
import Index from './components/main/Index.jsx';
import TeamView from './components/main/Team.jsx';
import { defaults } from 'react-chartjs-2';

defaults.global.animation.duration = 500;
defaults.global.events = ['click', 'touchend', 'mousemove', 'mouseout'];

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
      'mercedes',
      'red_bull',
      'williams',
      'renault',
      'mclaren'
    ]

    // State:
    this.state = {
      data: null,
      mobile: false
    };
    this.loader = this.loader.bind(this);
    this.getData = this.getData.bind(this);
    this.checkMobile = this.checkMobile.bind(this);

    this.getData();
  }

  // Fetch and load the stats for the app
  getData() {
    fetch(
      'https://raw.githubusercontent.com/SmCTwelve/f1/master/data/stats.json'
    )
    .then( (res) => res.status !== 200 ?
      Promise.reject(res.status + res.statusText) : Promise.resolve(res))
    .then( (res) => res.json())
    .then( (res) => this.setState({data: res}))
    .then( () => console.log("Stats fetch complete."))
    .catch( (err) => console.log(err));
  }

  checkMobile() {
    const mobile = (window.screen.width < 600 || window.screen.height < 500) ? true : false;
    if (mobile) {
      defaults.global.animation.duration = 200;
      defaults.global.hover.animationDuration = 200;
    }
    else {
      defaults.global.animation.duration = 500;
      defaults.global.hover.animationDuration = 400;
    }
    this.setState({mobile});
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

  componentDidMount() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  }

  render() {
    return(
      <Router history={hashHistory}>
        <Switch>
          {/* Index */}
          <Route
            exact path="/"
            render={(props) =>
              <Index {...props} mobile={this.state.mobile} teams={this.teams}
                load={this.loader} />
            }
          />
          {/* Team page */}
          <Route
            path={"/:team"}
            render={(props) => {
                const team = props.match.params.team;
                // Render nothing (keep loader) if fetch not complete
                if (this.state.data === null) {
                  return null;
                }
                // Render page for team if match, else redirect to home
                if (this.teams.includes(team)) {
                  return <TeamView {...props} mobile={this.state.mobile} team={team}
                    data={this.state.data} load={this.loader} />
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
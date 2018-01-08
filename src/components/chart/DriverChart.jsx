import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import * as charts from "./f1/data/data.js";

// Chart options
const options = {
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true
      },
      gridLines: {display: false}
    }],
    xAxes: [{
      gridLines: {display: false}
    }]
  }
}

/**
 * Controller for rendering driver win, pole, points and DNF charts.
 *
 * Props: `team` -- current team.
 *        `data` -- stats JSON data from API.
 */
class DriverChart extends Component {
  constructor(props) {
    super(props);

    this.team = this.props.team;
    this.data = this.props.data;
    this.showAll = this.showAll.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    charts.init(this.data);

    this.state = {
      charData: charts.driverWins(this.data, this.team),
      chart: "wins"
    }
  }

  // Toggle between all drivers or team only for chart scope
  showAll(bool) {
    bool ? this.team = null : this.team = this.props.team;
    this.handleUpdate(this.state.chart);
  }

  // Switch chart display
  handleUpdate(chart) {
    let res;
    switch (chart) {
      case "wins": res = charts.driverWins(this.data, this.team); break;
      case "poles": res = charts.driverPoles(this.data, this.team); break;
      case "points": res = charts.driverStandings(this.data, this.team); break;
      case "dnf": res = charts.driverDNFs(this.data, this.team); break;
    }
    this.setState({chartData: res, chart: chart});
  }

  render() {
    return(
      <div>
        <div>
          <StatsButton chart="wins" text="Wins" handleOnClick={this.handleUpdate} />
          <StatsButton chart="poles" text="Poles" handleOnClick={this.handleUpdate} />
          <StatsButton chart="points" text="Points" handleOnClick={this.handleUpdate} />
          <StatsButton chart="dnf" text="DNF" handleOnClick={this.handleUpdate} />
        </div>
        <div>
          <Bar data={this.state.charData} options={options} />
        </div>
        <div>
          <button onClick={() => this.showAll(true)}>All</button>
          <button onClick={() => this.showAll(false)}>Team</button>
        </div>
      </div>
    );
  }
}

/**
 *Render button to switch between chart display modes.
 *
 * Props: `chart` -- chart type (wins, poles, points, dnf).
 *        `text` -- button text.
 */
const StatsButton = (props) => (
  <button onClick={() => props.handleOnClick(props.chart)}>{props.text}</button>
);

export default DriverChart;
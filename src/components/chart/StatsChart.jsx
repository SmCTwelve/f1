import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import * as charts from "./charts.js";

// Use black for team stat charts, always white bg
const fontColor = 'rgba(0,0,0,0.9)';

// Chart options
const options = {
  responsive: true,
  scales: {
    yAxes: [{
      ticks: {
        beginAtZero: true,
        fontColor
      },
      gridLines: {display: false}
    }],
    xAxes: [{
      gridLines: {display: false},
      ticks: {fontColor}
    }]
  },
  legend: {labels: {fontColor}}
}

/**
 * Controller for rendering driver win, pole, points and DNF charts.
 *
 * Props: `team` -- current team.
 *        `data` -- stats JSON data from API.
 */
class StatsChart extends Component {
  constructor(props) {
    super(props);

    this.team = this.props.team;
    this.data = this.props.data;
    this.showAll = this.showAll.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);

    charts.init(this.data);

    this.state = {
      chartData: charts.driverStandings(this.data, this.team),
      chart: "points"
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
      <div className="chart-container">
        <div className="data-buttons">
          <StatsButton chart="wins" text="Wins" handleOnClick={this.handleUpdate} />
          <StatsButton chart="poles" text="Poles" handleOnClick={this.handleUpdate} />
          <StatsButton chart="points" text="Points" handleOnClick={this.handleUpdate} />
          <StatsButton chart="dnf" text="DNF" handleOnClick={this.handleUpdate} />
        </div>
        <div className="stats-chart">
          <Bar data={this.state.chartData} options={options} />
        </div>
        <div className="mode-buttons">
          <button className="btn" onClick={() => this.showAll(true)}>All</button>
          <button className="btn" onClick={() => this.showAll(false)}>Team</button>
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
  <button className="btn" onClick={() => props.handleOnClick(props.chart)}>
    {props.text}
  </button>
);

export default StatsChart;
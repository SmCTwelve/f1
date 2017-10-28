import React from 'react';
import ReactDOM from 'react-dom';
import Team from './Team.jsx';
import TeamInfo from './teams.json';
import './styles/main.scss';

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <Team team="fer" title="SCUDERIA FERRARI" />,
  document.getElementById("root")
);

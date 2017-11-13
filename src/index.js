import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './styles/main.scss';

if (module.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <App />,
  document.getElementById("root")
);

/**
 * TODO
 *
 * API:
 *  Fetch team JSON data
 *  Update team JSON data
 *    Specify team parameter and the key to fetch, or array of keys
 *  Use AJAX
 *  Use composition - different objects/JSON files for entities e.g. driver to update a driver's stats and
 *  automatically update elsewhere through reference to the driver object/file.
 *
 *  e.g.
 *  updateTeam(ferrari, keys)
 */

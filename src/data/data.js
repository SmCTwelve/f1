const fetch = require("node-fetch");
const api = "https://ergast.com/api/f1/";

const status = (res) => {
  if (res.status !== 200) {
    console.log("Request error:" + res.status);
    return Promise.reject(new Error(res.statusText));
  }
  else {
    return Promise.resolve(res);
  }
}

const json = (res) => res.json();
const error = (err) => console.log("Request failed", err);
const log = (data) => console.log("Result: ", data);

/**
 * Get the wins for a driver. Filter results to include the season and round, if given.
 * Takes an object with the parameter to include, only driver is required.
 *
 * E.g. to get all wins for Alonso in 2007 (round not specified):
 *
 * `getDriverWins( {driver: 'alonso', season: 2007} )`
 *
 * @param {*} driver Driver id e.g. 'alonso' (Required)
 * @param {*} season Season to filter e.g. 2008 or 'current'
 * @param {*} round Race in the season
 */
const getWins = ({driver, season=null, round=null}) => {
  let url = api;
  // Round and season
  if (round !== null && season !== null) {
    url += `${season}/${round}/drivers/${driver}/results/1`;
  }
  // Season only
  else if (season !== null) {
    url += `${season}/drivers/${driver}/results/1`;
  }
  // Driver only, all seasons
  else {
    url += `drivers/${driver}/results/1`;
  }
  fetch(url + '.json')
      .then(status).then(json).then(log).catch(error);
}

/**
 * Returns the number of pole positions for the driver in the season (if given)
 * or for all seasons in their career.
 *
 * @param {*} driver Driver id e.g. 'alonso'
 * @param {*} season The season to filter (optional)
 */
const getPoles = (driver, season=null) => {
  let url = api;
  if (season !== null) {
    url += `${season}/drivers/${driver}/qualifying/1`;
  }
  else {
    url += `drivers/${driver}/qualifying/1`;
  }
  fetch(url + '.json')
    .then(status).then(json).then(log).catch(error);
}

/**
 * Returns the points and WDC/WCC position of the driver/constructor for the season.
 *
 * @param {*} name The driver or constructor name
 * @param {boolean} constructor If the search is for constructors standings
 */
const getPoints = (name, constructor=false) => {
  let url = api;
  if (constructor) {
    url += `current/constructors/${name}/constructorStandings`;
  }
  else {
    url += `current/drivers/${name}/driverStandings`;
  }
  fetch(url + '.json')
    .then(status).then(json).then(log).catch(error);
}

/**
 * Returns information about a driver or a constructor such as code, dob, full name.
 *
 * @param {*} name The driver or constructor name to search e.g. 'alonso'/'mclaren'
 * @param {boolean} constructor The name is a constructor
 */
const getInfo = (name, constructor=false) => {
  let url = api;
  if (constructor) {
    url += `constructors/${name}`;
  }
  else {
    url += `drivers/${name}`;
  }
  fetch(url + '.json')
    .then(status).then(json).then(log).catch(error);
}

/**
 * Fetch finishing status for the specified driver for the season, if given. Then filter
 * results to exclude 'Finished' status and return the result.
 *
 * @param {*} driver The driver name
 * @param {*} season The season to filter
 */
const getDNF = (driver, season=null) => {
  let url = api;
  if (season !== null) {
    url += `${season}/drivers/${driver}/status`;
  }
  else {
    url += `drivers/${driver}/status`;
  }
  fetch(url + '.json')
    .then(status).then(json).then(log).catch(error);
}

module.exports = {
  getWins,
  getInfo,
  getDNF,
  getPoles,
  getPoints
};

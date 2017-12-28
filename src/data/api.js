const fetch = require("node-fetch");
const api = "https://ergast.com/api/f1/";

/**
 * Check response status for errors.
 * @param {*} res Status code
 */
const status = (res) => {
  if (res.status !== 200) {
    console.log("Request error:" + res.status);
    return Promise.reject(new Error(res.statusText));
  }
  else {
    return Promise.resolve(res);
  }
}

// Utility functions
const json = (res) => res.json();
const error = (err) => console.log("Request failed", err);
const log = (data) => console.log("Result: ", data);

/**
 * Get the wins for a driver. Filter results to include the season, if given.
 * Takes an object with the parameter to include, only driver is required.
 *
 * E.g. to get all wins for Alonso in 2007 (round not specified):
 * @param {*} driver Driver id e.g. 'alonso' (Required)
 * @param {*} season Season to filter e.g. 2008 or 'current'
 * @returns {Promise}
 */
const getWins = (driver, season=null) => {
  console.log(`Getting wins for ${driver}...`);
  let url = api;
  // Season given
  if (season !== null) {
    url += `${season}/drivers/${driver}/results/1`;
  }
  // Driver only, all seasons
  else {
    url += `drivers/${driver}/results/1`;
  }
  return fetch(url + '.json')
      .then(status)
      .then(json)
      .then( (data) => data.MRData.total)
      .catch(error);
}

/**
 * Returns the number of pole positions for the driver in the season (if given)
 * or for all seasons in their career.
 *
 * @param {*} driver Driver id e.g. 'alonso'
 * @param {*} season The season to filter (optional)
 * @returns {Promise}
 */
const getPoles = (driver, season=null) => {
  console.log(`Getting poles for ${driver}...`);
  let url = api;
  if (season !== null) {
    url += `${season}/drivers/${driver}/qualifying/1`;
  }
  else {
    url += `drivers/${driver}/qualifying/1`;
  }
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => data.MRData.total)
    .catch(error);
}

/**
 * Returns the points and WDC/WCC position of the driver/constructor for the season.
 *
 * @param {*} name The driver or constructor name
 * @param {boolean} constructor If the search is for constructors standings
 * @returns {Promise}
 */
const getPoints = (name, constructor=false) => {
  console.log(`Getting points for ${name}...`);
  let url = api;
  if (constructor) {
    url += `current/constructors/${name}/constructorStandings`;
  }
  else {
    url += `current/drivers/${name}/driverStandings`;
  }
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => {
      const key = constructor ? 'ConstructorStandings' : 'DriverStandings';
      const standings = data.MRData.StandingsTable.StandingsLists[0];
      return {
        points: standings[key][0].points,
        pos: standings[key][0].position
      };
    })
    .catch(error);
}

/**
 * Returns information about a driver such as code, dob, full name as an object.
 * @param {*} driver The driver or constructor name to search e.g. 'alonso'/'mclaren'
 * @returns {Promise}
 */
const getInfo = (driver) => {
  console.log(`Getting info for ${driver}...`);
  const url = api + `drivers/${driver}`;
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => {
      const info = data.MRData.DriverTable.Drivers[0];
      const age = (dob) => {
        const then = new Date(dob);
        const now = new Date();
        return now.getFullYear() - then.getFullYear();
      };
      return {
        driverId: info.driverId,
        no: info.permanentNumber,
        code: info.code,
        firstName: info.givenName,
        lastName: info.familyName,
        age: age(info.dateOfBirth),
        nationality: info.nationality
      };
    })
    .catch(error);
}

/**
 * Returns a Promise with all constructors for the given season.
 * @param {*} season The season to filter
 * @returns {Promise}
 */
const getConstructors = (season) => {
  console.log('Getting constructors...');
  let url = api;
  if (season !== null) {
    url += `${season}/constructors`;
  }
  else {
    url += `constructors`;
  }
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => data.MRData.ConstructorTable.Constructors.map( item => item.constructorId))
    .catch(error);
}

/**
 * Returns a Promise with all drivers for the given season and who drive for the constructor (if given).
 * @param {*} season The season to filter
 * @param {*} constructor The constructor to filter (Optional)
 * @returns {Promise}
 */
const getDrivers = (season, constructor=null) => {
  console.log('Getting drivers...');
  let url = api;
  if (constructor !== null) {
    url += `${season}/constructors/${constructor}/drivers`;
  }
  else {
    url += `${season}/drivers`;
  }
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => data.MRData.DriverTable.Drivers.map( item => item.driverId))
    .catch(error);
}

/**
 * Fetch finishing status for the specified driver for the season, if given. Then filter
 * results to exclude 'Finished' status and return the result.
 *
 * @param {*} driver The driver name
 * @param {*} season The season to filter
 * @returns {Promise}
 */
const getDNF = (driver, season=null) => {
  console.log(`Getting DNFs for ${driver}...`);
  let url = api;
  if (season !== null) {
    url += `${season}/drivers/${driver}/status`;
  }
  else {
    url += `drivers/${driver}/status`;
  }
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => {
      const regex = /\+\d{1,}/;
      const status = data.MRData.StatusTable.Status;
      let result = status.filter( item => !regex.test(item.status) && item.status !== 'Finished');
      result = result.reduce( (prev, current) => prev + Number(current.count), 0);
      return result;
    })
    .catch(error);
}

module.exports = {
  getWins,
  getInfo,
  getDNF,
  getPoles,
  getPoints,
  getConstructors,
  getDrivers
};
const fetch = require("node-fetch");
const api = "https://ergast.com/api/f1/";

// ###############
// Get engine component usage from differnt API

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
const error = (err) => console.log("Request failed: ", err.message);
const log = (data) => console.log("Result: ", data);
const delay = (ms) => Promise.all([new Promise(resolve => setTimeout(resolve, ms))]);
const age = (dob) => {
  const then = new Date(dob);
  const now = new Date();
  return now.getFullYear() - then.getFullYear();
};

/**
 * Get the wins for a driver. Filter results to include the season, if given.
 * Takes an object with the parameter to include, only driver is required.
 *
 * @param {*} driver Driver id e.g. 'alonso' (Required)
 * @param {*} season Season to filter e.g. 2008 or 'current'
 * @returns {Promise<number>}
 */
const getWins = (driver, season=null) => {
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
 * @returns {Promise<number>}
 */
const getPoles = (driver, season=null) => {
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
 * Returns the points and WDC/WCC position of the driver/team for the season.
 *
 * @param {*} name The driver or team name
 * @param {boolean} team If the search is for teams standings
 * @returns {Promise}
 */
const getPoints = (name, season, team=false) => {
  let url = api;
  if (team) {
    url += `${season}/constructors/${name}/constructorStandings`;
  }
  else {
    url += `${season}/drivers/${name}/driverStandings`;
  }
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => {
      const key = team ? 'ConstructorStandings' : 'DriverStandings';
      const standings = data.MRData.StandingsTable.StandingsLists[0];
      return {
        points: standings[key][0].points,
        pos: standings[key][0].position
      };
    })
    .catch(error);
}

/**
 * Return total championships for the team or driver.
 * @param {*} name
 * @param {*} team
 */
const getChampionships = (name, team=false) => {
  let url = api;
  if (team) {
    url += `constructors/${name}/constructorStandings/1`;
  }
  else {
    url += `drivers/${name}/driverStandings/1`;
  }
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => data.MRData.total)
    .catch(error);
}

/**
 * Returns information about a driver such as code, dob, full name as an object.
 * @param {*} driver The driver or team name to search e.g. 'alonso'/'mclaren'
 * @param {*} season The season to filter
 * @returns {Promise}
 */
const getInfo = (driver, season) => {
  let info;
  const url = api + `drivers/${driver}`;
  return fetch(url + '.json')
    .then(status)
    .then(json)
    // Fetch stats for the driver, wait until all complete and return promise
    .then( (data) => {
      info = data.MRData.DriverTable.Drivers[0];
      // Wait for all promise functions to resolve, return array of results
      return Promise.all([
        getWins(driver),
        getPoles(driver),
        getPoints(driver, season),
        getDNF(driver, season),
        getChampionships(driver, false),
        getRaceResults(driver, season)
      ]);
    })
    // Construct driver object
    .then( (data) => {
      return {
        id: info.driverId,
        no: info.permanentNumber,
        code: info.code,
        firstName: info.givenName,
        lastName: info.familyName,
        age: age(info.dateOfBirth),
        nationality: info.nationality,
        stats: {
          wins: data[0],
          poles: data[1],
          points: data[2].points,
          wdc: data[2].pos,
          dnf: data[3],
          championships: data[4]
        },
        results: data[5]
      };
    })
    .catch(error);
}

/**
 * Returns an array of race result objects for the driver.
 * @param {*} driver
 * @param {*} season
 * @returns {Promise<Array>}
 */
const getRaceResults = (driver, season) => {
  const url = api + `${season}/drivers/${driver}/results`;
  let races;
  return fetch(url + '.json')
    .then(status)
    .then(json)
    // Iscolate the array of race results from the data
    .then( (data) => data.MRData.RaceTable.Races)
    // Get best qualifying times for each race as new array, pass to next step
    .then( (data) => {
      races = data;
      return getBestQualiTimes(driver, season);
    })
    // Map the array of race results to a new array of objects with the desired data
    .then( (quali) => {
      return races.map( (race, index) => {
        const results = race.Results[0];
        // Check if there are any timing results (no participation)
        const raced = 'FastestLap' in results ? true : false;
        return {
          round: race.round,
          start: results.grid,
          finish: results.position,
          fastestLap: raced ? results.FastestLap.Time.time : '0:00.000',
          bestQuali: quali[index],
          avgSpeed: raced ? Number(results.FastestLap.AverageSpeed.speed) : 0
        }
      });
    })
    .catch(error);
}

/**
 * Return array of best qualifying times per race for the given driver.
 *
 * Looks for Q3 time, else Q2, else Q1.
 * @param {*} driver
 * @param {*} season
 */
const getBestQualiTimes = (driver, season) => {
  let races;
  const url = api + `${season}/drivers/${driver}/qualifying`;
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => {
      races = data.MRData.RaceTable.Races;
      return races.map( (race) => {
        if ('QualifyingResults' in race) {
          const results = race.QualifyingResults[0];
          if ('Q3' in results) {
            return results.Q3;
          }
          else if ('Q2' in results) {
            return results.Q2;
          }
          else if ('Q1' in results) {
            return results.Q1;
          }
          else {
            return '0:00.000';
          }
        }
        else {
          return '0:00.000';
        }
      });
    })
    .catch(error);
}

/**
 * Returns a Promise with all teams for the given season.
 * @param {*} season The season to filter
 * @returns {Promise<Array>}
 */
const getTeams = (season) => {
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
 * Returns a Promise with all drivers for the given season and who drive for the team (if given).
 * @param {*} season The season to filter
 * @param {*} team The team to filter (Optional)
 * @returns {Promise<Array>}
 */
const getDrivers = (season, team=null) => {
  let url = api;
  if (team !== null) {
    url += `${season}/constructors/${team}/drivers`;
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
 * @returns {Promise<number>}
 */
const getDNF = (driver, season=null) => {
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
  getTeams,
  getDrivers,
  getRaceResults,
  getBestQualiTimes,
  getChampionships
};
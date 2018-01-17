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
const error = (err) => console.log("Request failed", err);
const log = (data) => console.log("Result: ", data);
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
const getPoints = (name, team=false) => {
  let url = api;
  if (team) {
    url += `current/constructors/${name}/constructorStandings`;
  }
  else {
    url += `current/drivers/${name}/driverStandings`;
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
        getWins(driver, season),
        getPoles(driver, season),
        getPoints(driver),
        getDNF(driver, season),
        getChampionships(driver, false),
        getRaceResults(driver, season)
      ]);
    })
    // Construct driver object
    .then( (results) => {
      return {
        id: info.driverId,
        no: info.permanentNumber,
        code: info.code,
        firstName: info.givenName,
        lastName: info.familyName,
        age: age(info.dateOfBirth),
        nationality: info.nationality,
        stats: {
          wins: results[0],
          poles: results[1],
          points: results[2].points,
          wdc: results[2].pos,
          dnf: results[3],
          championships: results[4]
        },
        results: results[5]
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
    // Get best qualifying time for each race as new array, pass to next step
    .then( (data) => {
      console.log(data);
      races = data;
      return Promise.all(races.map( (race) => getBestQualiTime(driver, season, race.round)));
    })
    // Map the array of race results to a new array of objects with the desired data
    .then( (quali) => {
      console.log(quali);
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
 * Return best qualifying time for the specified driver and race.
 *
 * Looks Q3 if completed, else Q2, else Q1.
 * @param {*} driver
 * @param {*} season
 * @param {*} round
 */
const getBestQualiTime = (driver, season, round) => {
  const url = api + `${season}/${round}/drivers/${driver}/qualifying`;
  return fetch(url + '.json')
    .then(status)
    .then(json)
    .then( (data) => data.MRData.RaceTable.Races[0].QualifyingResults[0])
    .then( (results) => {
      if ('Q3' in results) {
        return results.Q3;
      }
      else if ('Q2' in results) {
        return results.Q2;
      }
      else {
        return results.Q1;
      }
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
  getBestQualiTime,
  getChampionships
};
const fs = require("fs");
const api = require("./api.js");

// Global data object to be modifed and written to JSON
let data = {};

/**
 * Usage: `node data <[create[-c]|update[-u]|help[-h]>`
 */
const main = (args) => {
  if (args === "create" || args === "-c") {
    create();
  }
  else if (args === "update" || args === "-u") {
    // update
  }
  else {
    console.log("Usage: node data <[create[-c]|update[-u]|help[-h]]>");
  }
};

/**
 * Get an array of teams for the season and add them to the data object.
 *
 * @param {Object} data Global data object
 * @param {String|Number} season Season to filter
 * @returns {Promise<Array>} Promise containing an array of teams
 */
const addteams = (data, season) => {
  let teams;
  console.log("Getting teams...");
  // return array of teams
  return api.getteams(season)
    .then( (res) => {
      // Get points and WCC for each team, return array of results
      teams = res;
      return Promise.all(res.map( (team) => {
        return api.getPoints(team, true);
      }));
    })
    .then( (res) => {
      // Assign each name, points, and wcc position to data
      teams.forEach( (team, index) => {
        data[team] = {
          points: res[index].points,
          wcc: res[index].pos
        };
      });
      return teams;
    });
};

/**
 * For each team add the driver info.
 *
 * Fetch the drivers belonging to each team using Promise.all() to return a
 * 2d-array of drivers. Then map each driver array to a 2d-array of Promises.
 *
 * Resolve each inner Promise array using Promise.all() to yield their values as a 2d-array
 * of driver objects. Finally, for each team, insert the driver info.
 *
 * @param {Object} data Global data object to modify
 * @param {Array} teams Array of teams
 * @param {String|Number} season Season to filter
 * @returns {Promise[][]} Array of driver arrays
 */
const addDrivers = (data, teams, season) => {
  let res;
  // map teams array to getDriver() results
  // returns 2d array of driver groups per team: [[driver1, driver2], [driver3, driver4]]
  console.log("Getting drivers...");
  return Promise.all(teams.map( (team) => {
    return api.getDrivers(season, team);
  }))
  .then( (drivers) => {
    res = drivers;
    // map each driver in each array with getInfo() results
    // returns 2d array of promises: [[promise1, promise2], [promise3, promise4]]
    return Promise.all(drivers.map( (array) => {
      return array.map( (driver) => {
        return api.getInfo(driver);
      });
    }));
  })
  .then( (result) => {
    // resolve the promise values in each inner array
    // map each inner array with the result of Promise.all()
    return Promise.all(result.map( (inner) => {
      return Promise.all(inner);
    }));
  })
  .then( (info) => {
    // add the driver info for each team to the data object
    teams.forEach( (team, index) => {
      data[team].drivers = info[index];
    });
    return res;
  });
};

/**
 * Fetch and insert all statistical data for the given season and
 * return the modified data object as a Promise.
 *
 * @param {String|Number} season
 * @returns {Promise} Data object
 */
const addData = (season) => {
  return addteams(data, season)
    .then( (teams) => addDrivers(data, teams, season))
    .then( () => {
      console.log("Done.");
      console.log(data);
      return data;
    })
    .catch( (err) => console.log(err));
}

/**
 * Create a new file `stats.json` in the directory, backing up the existing file then
 * replacing if it exists. Populate the file with stringified JSON from the `data` object,
 * which should contain stats from the API. The created file will be used by the main
 * application and served to clients.
 */
const create = () => {
  addData(2017)
    .then(data => {
      try {
        fs.renameSync("../../data/stats.json", "../../data/stats.json.bak");
      }
      catch (e) {
        console.log("File doesn't exist, will not be backed up.");
      }
      fs.writeFile("../../data/stats.json", JSON.stringify(data), (err) => {
        if (err) throw err;
      });
    });
}

module.exports = {
  main
};

// ##########################
// TO DO
// Add update() functionality which takes params e.g.
//  'all' updates everything - intensive, inefficient
//  'd_stats' updates only the stats for each driver
// Will require refactoring, e.g. addDrivers currently does all the work,
// needs to be split into seperate functions e.g. getStats whilst keeping
// promise chain intact.
// Consider placing 'drivers' and 'teams' globally in storage to avoid
// requesting and processing them when they don't need updated.

// Get finish position for each race per driver to plot line graph showing race position trends accross season.

main(process.argv[2]);
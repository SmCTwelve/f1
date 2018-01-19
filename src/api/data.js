const fs = require("fs");
const api = require("./api.js");


// ##########################
// TO DO
// Add update() functionality which takes params e.g.

//  'all' updates everything - intensive, inefficient
//  'd_stats' updates only the stats for each driver
//  '[round]' update results (timings, finish pos...) for specified round,
//     avoids fetching already known results
//    (parent values e.g. points, wins, poles, dnf will still need updated)

// Will require refactoring, e.g. addDrivers currently does all the work,
// needs to be split into seperate functions e.g. getStats whilst keeping
// promise chain intact.

// Consider placing 'drivers' and 'teams' globally in storage to avoid
// requesting and processing them when they don't need updated.

// Add team and driver colours to object
// Add driver image url's to object


// Global data object to be modifed and written to JSON
let data = {};
let season = 2017;

/**
 * Usage: `node data <create | -c>`
 *        `node data <update | -u [all|results <round> ]>`
 */
const main = (args) => {
  if (args[2] === "create" || args[2] === "-c") {
    create();
  }
  else if ((args[2] === "update" || args[2] === "-u") && (args[3] === "results")) {
    // update results <round>
  }
  // update all
  else if ((args[2] === "update" || args[2] === "-u") && (args[3] === "all")) {
    update(true);
  }
  // help
  else {
    console.log(`
    Usage: node data <create | -c>
           node data <update | -u> [all|results <round> ]

    Description: create                   Fetches all team and driver data from scratch, creating a new file.
                 update all               Only updates data within each team such as drivers and stats.
                 update results <round>   Only updates race results for the given race. Also updates wins, points etc.`
    );
  }
};

/**
 * Get an array of teams for the season and add them to the data object.
 *
 * @param {Object} data Global data object
 * @param {String|Number} season Season to filter
 * @returns {Promise<Array>} Promise containing an array of teams
 */
const addTeams = (data, season) => {
  let teams;
  let points;
  console.log("Getting teams...");
  // return array of teams
  return api.getTeams(season)
    .then( (res) => {
      // Get points and WCC for each team, return array of results
      teams = res;
      return Promise.all(teams.map( (team) => {
        return api.getPoints(team, season, true);
      }));
    })
    .then( (res) => {
      // Get total championships for reach team, return array
      points = res;
      return Promise.all(teams.map( (team) => {
        return api.getChampionships(team, true);
      }));
    })
    .then( (champs) => {
      // Assign each name, points, and wcc position to data
      teams.forEach( (team, index) => {
        data[team] = {
          points: points[index].points,
          wcc: points[index].pos,
          championships: champs[index]
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
  let drivers;
  // map teams array to getDriver() results
  // returns 2d array of driver groups per team: [[driver1, driver2], [driver3, driver4]]
  return Promise.all(teams.map( (team) => {
    return api.getDrivers(season, team);
  }))
  // map each drivers array to info objects
  .then( (res) => {
    drivers = res;
    return getDriverInfo(drivers, season);
  })
  // add the driver info and results for each team to the data object
  .then( (info) => {
    teams.forEach( (team, index) => {
      data[team].drivers = info[index];
    });
  });
};

/**
 * Get info and stats for each driver.
 *
 * @param {Array} drivers 2D Array of drivers per team
 * @param {Number} season
 * @returns {Promise[][]}
 */
const getDriverInfo = (drivers, season) => {
  console.log("Getting driver info...");
  return awaitAllDriverRequests(drivers, season, api.getInfo)
    .then( (result) => resolvePromiseArrays(result));
}

/**
 * Requests data for each driver per team by mapping each driver array to an array of
 * Promise-wrapped function calls.
 *
 * @param {Array} driversList 2D Array of driver arrays [[driver1, driver2], [driver3, driver4]]
 * @param {Number} season Global season filter
 * @param {Function} request Function reference to be called on each driver
 * @returns {Promise[][]} 2D Array of Promises to be resolved [[Promise1, Promise2], [Promise3, Promise4]]
 */
const awaitAllDriverRequests = (driversList, season, request) => {
  return Promise.all(driversList.map( (drivers) => {
    return drivers.map( (driver) => {
      return request(driver, season);
    });
  }));
}

/**
 * Resolves a 2D Array of Promises by mapping each array to the resolved values.
 *
 * @param {Array} array 2D Array of Promises
 * @returns {Promise[][]} 2D Array of resolved values
 */
const resolvePromiseArrays = (array) => {
  return Promise.all(array.map( (innerArray) => {
    return Promise.all(innerArray);
  }));
}

/**
 * Fetch and insert all statistical data for the given season and
 * return the modified data object as a Promise.
 *
 * @param {String|Number} season
 * @returns {Promise} Data object
 */
const addData = (season) => {
  return addTeams(data, season)
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
  backup();
  addData(season)
    .then(data => {
      fs.writeFile("../../data/stats.json", JSON.stringify(data), (err) => {
        if (err) throw err;
      });
    });
}

/**
 * Attempt to backup existing stats.json file, if it exists.
 */
const backup = () => {
  try {
    fs.copyFileSync("../../data/stats.json", "../../data/stats.json.bak");
    console.log("Stats successfully backed up.");
  }
  catch (e) {
    console.log("File doesn't exist, will not be backed up.", e);
  }
}

/**
 * Update stats file by replacing existing data.
 *
 * Replace all stats and driver info with `all` as `true`.
 *
 * Replace only race results for a specific race by passing `all` as `false` and
 * `round` as the race number.
 * @param {boolean} all
 * @param {number} round
 */
const update = (all, round=null) => {
  backup();
  // Update results only for the given round
  if (all === false) {
    // For each team and driver, update stats and fetch only results for given round
  }
  // Update all driver info
  else {
    // Read in the existing data from file
    fs.readFile("../../data/stats.json", (err, buffer) => {
      if (err) throw err;
      data = JSON.parse(buffer);
      console.log("DATA BUFFER: ", data);
      const teams = Object.keys(data);
      console.log("TEAMS", teams);
      // Replace all team driver info then write back into file
      // addDrivers(data, teams, season)
      //   .then( res => console.log(res))
      //   .then( () => {
      //     fs.writeFile("../../data/stats.json", JSON.stringify(data), (err) => {
      //       if (err) throw err;
      //       console.log("Stats successfully updated.");
      //     });
      //   })
      //   .catch( err => console.log(err));
    })
  }
}

module.exports = {
  main
};

main(process.argv);
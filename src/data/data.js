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
 * Get an array of constructors for the season and add them to the data object.
 *
 * @param {Object} data Global data object
 * @param {String|Number} season Season to filter
 * @returns {Promise<Array>} Promise containing an array of constructors
 */
const addConstructors = (data, season) => {
  // return array of constructors
  return api.getConstructors(season)
    .then( (constructors) => {
      console.log("Getting constructors...");
      constructors.forEach( (constructor) => {
        data[constructor] = {};
      });
      return constructors;
    });
};

/**
 * For each constructor add the driver info.
 *
 * Fetch the drivers belonging to each constructor using Promise.all() to return a
 * 2d-array of drivers. Then map each driver array to a 2d-array of Promises.
 *
 * Resolve each inner Promise array using Promise.all() to yield their values as a 2d-array
 * of driver objects. Finally, for each constructor, insert the driver info.
 *
 * @param {Object} data Global data object to modify
 * @param {Array} constructors Array of constructors
 * @param {String|Number} season Season to filter
 * @returns {Promise} Empty promise
 */
const addDrivers = (data, constructors, season) => {
  // map constructors array to getDriver() results
  // returns 2d array of driver groups per constructor: [[driver1, driver2], [driver3, driver4]]
  console.log("Getting drivers...");
  return Promise.all(constructors.map( (constructor) => {
    return api.getDrivers(season, constructor);
  }))
  .then( (drivers) => {
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
    // add the driver info for each constructor to the data object
    constructors.forEach( (constructor, index) => {
      data[constructor].drivers = info[index];
    });
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
  return addConstructors(data, season)
    .then( (constructors) => addDrivers(data, constructors, season))
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
  addData("current")
    .then(data => {
      try {
        fs.renameSync("./stats.json", "./stats.json.bak");
      }
      catch (e) {
        console.log("File doesn't exist, will not be backed up.");
      }
      fs.writeFile("./stats.json", JSON.stringify(data), (err) => {
        if (err) throw err;
      });
    });
}

module.exports = {
  main
};

main(process.argv[2]);
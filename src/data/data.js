const fs = require("fs");
const api = require("./api.js");

/**
 * Usage: `node data <[create[-c]|update[-u]|help[-h]>`
 */
const main = (args) => {
  if (args === "create" || args === "-c") {
    // create
  }
  else if (args === "update" || args === "-u") {
    // update
  }
  else {
    console.log("Usage: node data <[create[-c]|update[-u]|help[-h]]>");
  }
};

// CLEAN UP === ADD DOCSTRING #######
const fetchData = (season) => {
  let data = {};
  // return array of constructors
  api.getConstructors(season)
    .then( (constructors) => {
      constructors.forEach( (constructor) => {
        data[constructor] = {drivers: {}};
      });
      return constructors;
    })
    // get an array of drivers for each constructor
    .then( (constructors) => {
      // map the array of constructors to getDriver() calls, return a single promise with results
      return Promise.all(constructors.map( (constructor) => {
        return api.getDrivers(season, constructor);
      }))
    })
    // add the drivers for each constructor
    .then( (drivers) => {
      Object.keys(data).forEach( (constructor, index) => {
        drivers[index].forEach( (driver) => {
          data[constructor].drivers[driver] = {};
        });
      });
    })
    .then( () => console.log(data))
    .catch( (err) => console.log(err));
}

/**
 * Create a new file `stats.json` in the directory, backing up the existing file then
 * replacing if it exists. Populate the file with stringified JSON from the `data` object,
 * which should contain stats from the API. The created file will be used by the main
 * application and served to clients.
 */
const create = () => {
  fs.renameSync("stats.json", "stats.json.bak");
  fs.writeFile("stats.json", JSON.stringify(data), (err) => {
    if (err) throw err;
  });
}

module.exports = {
  main
};


fetchData('current');
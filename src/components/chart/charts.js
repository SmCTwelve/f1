// Global array of team names
let _TEAMS;
// Global 2D array of driver objects per team
let _DRIVERS;
// Global array of colours in order of drivers
let _COLOURS;
// Global array of race number/rounds
let _ROUNDS;

// ##### TO DO #####

// Total WCC/WDC titles
// Component penalties polar chart
// Timing line graphs

// Consider using each driver group as seperate datasets per team, with own label, color etc.
// Would avoid having to flatten the 2D arrays, instead using each inner array as a new dataset.

/**
 * Initialise global teams and drivers references.
 *
 * @param {Object} stats Global stats.json object from main app.
*/
export const init = (stats) => {
  _TEAMS = Object.keys(stats);
  _DRIVERS = _TEAMS.map( (team) => {
    return stats[team].drivers;
  });
  _ROUNDS = _DRIVERS[0][0].results.map( (result) => result.round);
}

/**
 * Return only the drivers for the given team.
 *
 * @param {Object} stats Global stats.json from main app.
*/
export const filterDrivers = (stats, team) => {
  return stats[team].drivers;
}

/**
 * Return array of driver codes, optionally filtered by team.
 *
 * @param {Object} stats Global stats.json from main app.
 * @param {String} team Team name.
*/
const getDriverCodes = (stats, team=null) => {
  if (team !== null) {
    return filterDrivers(stats, team).map( (driver) => driver.code);
  }
  return flattenDriverArrays('driver.code');
}

/**
 * Takes two-dimenstional array of driver objects per team and flattens to a single array
 * containing the value of the desired key for each driver, e.g. stats.points.
 *
 * @param {String} key The full key to search for, e.g. "driver.points.stats"
 * @returns {Array} Array of values in the order of the drivers.
 */
const flattenDriverArrays = (key) => {
  return _DRIVERS.reduce( (prev, cur) => {
    // driver is used when eval(key) called with string e.g. 'driver.code'
    const val = cur.map( (driver) => eval(key));
    return prev.concat(val);
  }, []);
}

/**
 * Return chart data object with the given values and title.
 *
 * @param {Object} stats Global stats.json object from main app.
 * @param {} team Team name (or null).
 * @param {Array} data Array of data.
 * @param {String} title Chart title.
*/
const makeDriverChart = (stats, team, data, title) => {
  return {
    labels: getDriverCodes(stats, team),
    datasets: [
      {
        label: title,
        data: data,

      }
    ]
  };
}

/**
 * Return chart data representing team championship positions.
 *
 * @param {Object} stats Global stats.json object from main app.
 * @param {Array} teams Array of team names.
*/
export const teamStandings = (stats, teams) => {
  const points = teams.map( (team) => stats[team].points);
  return {
    labels: teams,
    datasets: [
      {
        label: "Team Standings (Season)",
        data: points,
      }
    ]
  };
}

/**Returns chart data for driver poles. Optionally filter only drivers in the team. */
export const driverPoles = (stats, team=null) => {
  let poles;
  if (team !== null) {
    poles = filterDrivers(stats, team).map( (driver) => driver.stats.poles);
  }
  else {
    poles = flattenDriverArrays('driver.stats.poles');
  }
  return makeDriverChart(stats, team, poles, "Career Pole Positions");
}

/**Return chart with driver win stats. Optional team filter. */
export const driverWins = (stats, team=null) => {
  let wins;
  if (team !== null) {
    wins = filterDrivers(stats, team).map( (driver) => driver.stats.wins);
  }
  else {
    wins = flattenDriverArrays('driver.stats.wins');
  }
  return makeDriverChart(stats, team, wins, "Career Race Wins");
}

/** Return driver DNF stats with optional filter by team. */
export const driverDNFs = (stats, team=null) => {
  let dnf;
  if (team !== null) {
    dnf = filterDrivers(stats, team).map( (driver) => driver.stats.dnf);
  }
  else {
    dnf = flattenDriverArrays('driver.stats.dnf');
  }
  return makeDriverChart(stats, team, dnf, "Race Retirements (Season)");
}

/** Return driver championship standings for all drivers or optionally by team. */
export const driverStandings = (stats, team=null) => {
  let pts;
  if (team !== null) {
    pts = filterDrivers(stats, team).map( (driver) => driver.stats.points);
  }
  else {
    pts = flattenDriverArrays('driver.stats.points');
  }
  return makeDriverChart(stats, team, pts, "Driver Standings (Season)");
}

/** Return line chart comparing driver qualifying and best lap per race. */
export const driverTimings = (driver) => {
  let race = [];
  let quali = [];
  driver.results.forEach( (result) => {
    race.push(result.fastestLap);
    quali.push(result.bestQuali);
  });
  return {
    labels: _ROUNDS,
    datasets: [
      {
        label: "Best Lap",
        data: race,
        borderColor: '#bf1429',
        backgroundColor: '#bf1429',
        borderWidth: 2,
        fill: false,
        pointRadius: 0.75,
        spanGaps: true
      },
      {
        label: "Qualifying",
        data: quali,
        borderColor: '#287b49',
        backgroundColor: '#287b49',
        borderWidth: 2,
        fill: false,
        pointRadius: 0.75,
        spanGaps: true
      }
    ]
  };
}

/**
 * Return chart combining win and poles for single driver object.
 */
export const driverPoleVsWins = (driver) => {
  const wins = driver.stats.wins;
  const poles = driver.stats.poles;
  if (wins !== 0 || poles !== 0) {
    return {
      labels: ["Wins", "Poles"],
      datasets: [
        {
          data: [wins, poles]
        }]
    };
  }
  else {
    return {
      labels: ["None"],
      datasets: [{data: [1]}]
    };
  }
}

/**
 * Returns a line chart comparing the start and finish positions for each race.
 */
export const driverStartFinish = (driver) => {
  let starts = [];
  let finishes = [];
  driver.results.forEach( (result) => {
    starts.push(result.start);
    finishes.push(result.finish);
  });
  return {
    labels: _ROUNDS,
    datasets: [
      {
        label: "Start",
        data: starts,
        borderColor: '#287b49',
        backgroundColor: '#287b49',
        fill: false,
        pointRadius: 0.75,
        spanGaps: true,
        borderWidth: 2
      },
      {
        label: "Finsh",
        data: finishes,
        borderDash: [3],
        borderColor: '#bf1429',
        backgroundColor: '#bf1429',
        fill: false,
        pointRadius: 0.75,
        spanGaps: true,
        borderWidth: 2
      }
    ]
  };
}

/**
 * Return polar chart showing use of each engine component.
 *
 * @param {*} driver Driver object.
 */
export const driverComponents = (driver) => {
  let data;
  for (let i in driver.components) {
    data.push(driver.components[i]);
  }
  if ('driver' in data) {
    delete data.driver;
  }
  return {
    labels: ["ICE", "TC", "MGU-H", "MGU-K", "ES", "CE"],
    datasets: [
      {
        data
      }
    ]
  };
}